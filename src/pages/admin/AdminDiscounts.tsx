import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { trpc } from '../../providers/trpc'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

function gbp(pence: number) {
  return `£${(pence / 100).toFixed(2)}`
}

type DiscountRow = {
  id: number
  code: string
  description: string | null
  type: 'percent' | 'fixed'
  value: number
  minSubtotalPence: number
  maxUses: number | null
  usedCount: number
  startsAt: Date | string | null
  expiresAt: Date | string | null
  active: boolean
  createdAt: Date | string
}

type FormState = {
  code: string
  description: string
  type: 'percent' | 'fixed'
  value: string
  minSubtotal: string
  maxUses: string
  startsAt: string
  expiresAt: string
  active: boolean
}

const emptyForm: FormState = {
  code: '',
  description: '',
  type: 'percent',
  value: '',
  minSubtotal: '',
  maxUses: '',
  startsAt: '',
  expiresAt: '',
  active: true,
}

const inputCls =
  'w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary'

function formFromRow(d: DiscountRow): FormState {
  const toDateInput = (v: Date | string | null) => {
    if (!v) return ''
    const dt = new Date(v)
    return Number.isNaN(dt.getTime()) ? '' : dt.toISOString().slice(0, 10)
  }
  return {
    code: d.code,
    description: d.description ?? '',
    type: d.type,
    value: d.type === 'percent' ? String(d.value) : (d.value / 100).toFixed(2),
    minSubtotal: d.minSubtotalPence > 0 ? (d.minSubtotalPence / 100).toFixed(2) : '',
    maxUses: d.maxUses !== null ? String(d.maxUses) : '',
    startsAt: toDateInput(d.startsAt),
    expiresAt: toDateInput(d.expiresAt),
    active: d.active,
  }
}

export default function AdminDiscounts() {
  const utils = trpc.useUtils()
  const { data: discounts, isLoading } = trpc.discounts.list.useQuery()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<DiscountRow | null>(null)
  const [deleting, setDeleting] = useState<DiscountRow | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  const invalidate = () => utils.discounts.list.invalidate()
  const create = trpc.discounts.create.useMutation({
    onSuccess: () => {
      invalidate()
      setDialogOpen(false)
    },
    onError: (e) => setFormError(e.message),
  })
  const update = trpc.discounts.update.useMutation({
    onSuccess: () => {
      invalidate()
      setDialogOpen(false)
    },
    onError: (e) => setFormError(e.message),
  })
  const remove = trpc.discounts.remove.useMutation({
    onSuccess: () => {
      invalidate()
      setDeleting(null)
    },
  })
  const toggle = trpc.discounts.toggleActive.useMutation({ onSuccess: invalidate })

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormError(null)
    setDialogOpen(true)
  }
  const openEdit = (d: DiscountRow) => {
    setEditing(d)
    setForm(formFromRow(d))
    setFormError(null)
    setDialogOpen(true)
  }

  const valueNum = parseFloat(form.value)
  const minSubtotalNum = parseFloat(form.minSubtotal)
  const maxUsesNum = parseInt(form.maxUses, 10)
  const validationError = (() => {
    if (!editing && !/^[A-Za-z0-9-]{2,32}$/.test(form.code)) {
      return 'Code must be 2–32 characters: letters, numbers and dashes.'
    }
    if (Number.isNaN(valueNum) || valueNum <= 0) return 'Enter a valid discount value.'
    if (form.type === 'percent' && (valueNum < 1 || valueNum > 90)) return 'Percent must be 1–90.'
    if (form.minSubtotal && (Number.isNaN(minSubtotalNum) || minSubtotalNum < 0))
      return 'Minimum subtotal must be a positive amount.'
    if (form.maxUses && (Number.isNaN(maxUsesNum) || maxUsesNum <= 0))
      return 'Max uses must be a positive whole number.'
    if (form.startsAt && form.expiresAt && form.expiresAt <= form.startsAt)
      return 'Expiry must be after the start date.'
    return null
  })()

  const submit = () => {
    setFormError(null)
    const patch = {
      description: form.description || undefined,
      type: form.type,
      value: form.type === 'percent' ? Math.round(valueNum) : Math.round(valueNum * 100),
      minSubtotalPence: form.minSubtotal ? Math.round(minSubtotalNum * 100) : 0,
      maxUses: form.maxUses ? maxUsesNum : null,
      startsAt: form.startsAt ? new Date(`${form.startsAt}T00:00:00`) : null,
      expiresAt: form.expiresAt ? new Date(`${form.expiresAt}T23:59:59`) : null,
      active: form.active,
    }
    if (editing) {
      update.mutate({ id: editing.id, patch })
    } else {
      create.mutate({ code: form.code.toUpperCase(), ...patch })
    }
  }

  const now = new Date()
  const isExhausted = (d: DiscountRow) => d.maxUses !== null && d.usedCount >= d.maxUses
  const isExpired = (d: DiscountRow) => d.expiresAt !== null && new Date(d.expiresAt) < now
  const isScheduled = (d: DiscountRow) => d.startsAt !== null && new Date(d.startsAt) > now

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Discounts</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Promo codes customers can apply at checkout. Percent codes take 1–90% off the subtotal;
            fixed codes take a set amount off in pounds.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> New code
        </button>
      </div>

      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Discount</th>
                <th className="px-5 py-3">Min subtotal</th>
                <th className="px-5 py-3">Usage</th>
                <th className="px-5 py-3">Window</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Active</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {(discounts ?? []).map((d) => (
                <tr key={d.id} className="border-b border-border/60 last:border-0 hover:bg-secondary">
                  <td className="px-5 py-3">
                    <span className="font-mono font-bold">{d.code}</span>
                    {d.description && (
                      <p className="mt-0.5 max-w-[220px] truncate text-xs text-muted-foreground">
                        {d.description}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3 font-semibold">
                    {d.type === 'percent' ? `${d.value}%` : gbp(d.value)}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {d.minSubtotalPence > 0 ? gbp(d.minSubtotalPence) : '—'}
                  </td>
                  <td className="px-5 py-3">
                    {d.usedCount}/{d.maxUses ?? '∞'}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {d.startsAt || d.expiresAt ? (
                      <>
                        {d.startsAt ? new Date(d.startsAt).toLocaleDateString('en-GB') : '…'}
                        {' → '}
                        {d.expiresAt ? new Date(d.expiresAt).toLocaleDateString('en-GB') : '…'}
                      </>
                    ) : (
                      'Always'
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {isExhausted(d) && (
                        <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-bold text-slate-600">
                          Exhausted
                        </span>
                      )}
                      {isExpired(d) && (
                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                          Expired
                        </span>
                      )}
                      {isScheduled(d) && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
                          Scheduled
                        </span>
                      )}
                      {!isExhausted(d) && !isExpired(d) && !isScheduled(d) && d.active && (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                          Live
                        </span>
                      )}
                      {!d.active && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                          Disabled
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Switch
                      checked={d.active}
                      disabled={toggle.isPending}
                      onCheckedChange={(active) => toggle.mutate({ id: d.id, active })}
                      aria-label={`Toggle ${d.code}`}
                    />
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {new Date(d.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(d)}
                        className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-secondary"
                        aria-label={`Edit ${d.code}`}
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => setDeleting(d)}
                        className="rounded-lg border border-border p-2 text-red-600 hover:bg-red-50"
                        aria-label={`Delete ${d.code}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(discounts ?? []).length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-muted-foreground">
                    No discount codes yet — create your first promo code.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${editing.code}` : 'New discount code'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {!editing && (
              <div>
                <Label htmlFor="dc-code">Code</Label>
                <input
                  id="dc-code"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="SPRING20"
                  className={`${inputCls} mt-1.5 font-mono uppercase`}
                />
              </div>
            )}
            <div>
              <Label htmlFor="dc-desc">Description (internal)</Label>
              <input
                id="dc-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Spring launch offer"
                className={`${inputCls} mt-1.5`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dc-type">Type</Label>
                <select
                  id="dc-type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })}
                  className={`${inputCls} mt-1.5`}
                >
                  <option value="percent">Percentage</option>
                  <option value="fixed">Fixed amount</option>
                </select>
              </div>
              <div>
                <Label htmlFor="dc-value">{form.type === 'percent' ? 'Percent off (1–90)' : 'Amount off (£)'}</Label>
                <div className="mt-1.5 flex items-center gap-1">
                  {form.type === 'fixed' && <span className="text-sm text-muted-foreground">£</span>}
                  <input
                    id="dc-value"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    inputMode="decimal"
                    placeholder={form.type === 'percent' ? '20' : '5.00'}
                    className={inputCls}
                  />
                  {form.type === 'percent' && <span className="text-sm text-muted-foreground">%</span>}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dc-min">Min subtotal (£, optional)</Label>
                <input
                  id="dc-min"
                  value={form.minSubtotal}
                  onChange={(e) => setForm({ ...form, minSubtotal: e.target.value })}
                  inputMode="decimal"
                  placeholder="50.00"
                  className={`${inputCls} mt-1.5`}
                />
              </div>
              <div>
                <Label htmlFor="dc-max">Max uses (optional)</Label>
                <input
                  id="dc-max"
                  value={form.maxUses}
                  onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                  inputMode="numeric"
                  placeholder="Unlimited"
                  className={`${inputCls} mt-1.5`}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dc-start">Starts (optional)</Label>
                <input
                  id="dc-start"
                  type="date"
                  value={form.startsAt}
                  onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                  className={`${inputCls} mt-1.5`}
                />
              </div>
              <div>
                <Label htmlFor="dc-end">Expires (optional)</Label>
                <input
                  id="dc-end"
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className={`${inputCls} mt-1.5`}
                />
              </div>
            </div>
            <label className="flex items-center gap-2.5 text-sm font-semibold">
              <Switch
                checked={form.active}
                onCheckedChange={(active) => setForm({ ...form, active })}
              />
              Active
            </label>
            {formError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                {formError}
              </p>
            )}
          </div>
          <DialogFooter>
            <button
              onClick={() => setDialogOpen(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={!!validationError || create.isPending || update.isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {create.isPending || update.isPending
                ? 'Saving…'
                : editing
                  ? 'Save changes'
                  : 'Create code'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleting?.code}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the discount code. Orders that already used it are unaffected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {remove.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
              {remove.error.message}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleting && remove.mutate({ id: deleting.id })}
              disabled={remove.isPending}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {remove.isPending ? 'Deleting…' : 'Delete code'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
