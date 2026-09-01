# Noxptide Tracking Config

Use this file as the source of truth before making future tracking, Search Console, or canonical-domain updates for noxptide.co.uk.

## Canonical Site

- Active property / canonical domain: `https://www.noxptide.co.uk/`
- Non-www domain should 301 redirect to: `https://www.noxptide.co.uk/`
- Do not switch canonical URLs back to `https://noxptide.co.uk/` unless the site owner explicitly changes the live domain strategy.

## Google Search Console

Current verification tag for the `www` property:

```html
<meta name="google-site-verification" content="o4_RP59movwvJJxc_TpRjU5jsEpU0ocT_MvZyodyuWUQ" />
```

The previous non-www property/access should not be treated as the primary setup once the `www` property is verified.

## Google Analytics 4

Current GA4 measurement ID:

```text
G-6H4NBLYPTB
```

Current GA4 install snippet:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-6H4NBLYPTB"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-6H4NBLYPTB');
</script>
```

Do not reintroduce the old incorrect GA4 ID:

```text
G-QS3BEJ5G6K
```

## Account Access Reminder

Google account access must be managed inside Google Search Console and Google Analytics, not in this repository.

Requested SEO account:

```text
webmasterseo138@gmail.com
```
