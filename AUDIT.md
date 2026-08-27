# Accessibility & Performance Audit

## Project

-   **Repository:** `Rija-Khurram/portfolio` (`main`)
-   **Live deployment:** `https://portfolio-rija3.vercel.app`
-   **Stack:** Next.js 16, React 19, Tailwind CSS v4, AI SDK + Gemini
-   **Tested pages:** `/`, `/work`, `/chat`

## 1. Lighthouse Baseline (Mobile)

  Category           Before
  ---------------- --------
  Performance            78
  Accessibility          87
  Best Practices        100
  SEO                   100

## 2. Changes Made

### `app/layout.js`

-   Removed `maximumScale: 1` and `userScalable: false` so browser zoom
    is not restricted.
-   Added a **Skip to main content** link.

### `app/globals.css`

-   Added focus-visible styling for the skip link.

### `app/page.js`, `app/work/page.js`, `app/health/page.js`

-   Improved low-contrast text to meet the required contrast level.

### `app/components/Nav.js`

-   Added visible `focus-visible` outlines to navigation links.

### `app/chat/ChatInterface.js`

-   Added an `aria-live="polite"` status region for streamed AI
    responses.
-   Added visible focus states to interactive controls.
-   Added a visually hidden label for the message textarea.
-   Added `role="alert"` for inline input errors.
-   Improved Lead Score Card contrast.

### `app/chat/error.js`

-   Replaced the duplicate `<main>` wrapper with `<div>`.
-   Improved contrast and focus states.

### `app/chat/loading.js`

-   Added a loading status announcement.
-   Added `aria-hidden="true"` to decorative skeleton placeholders.

### Reviewed without changes

-   `app/about/page.js`
-   `app/contact/page.js`
-   `app/chat/page.js`
-   `app/components/ComplexityGrid.js`

## 3. Deployment

Changes were pushed to GitHub `main`, and Vercel automatically
redeployed the updated application.

## 4. Lighthouse After Fixes (Mobile)

  Page        Performance   Accessibility   Best Practices   SEO
  --------- ------------- --------------- ---------------- -----
  `/`              **93**         **100**          **100**    60
  `/chat`          **98**         **100**          **100**    60
  `/work`          **96**         **100**          **100**    60

**Result:** Performance and Accessibility targets were met on all tested
pages. Best Practices remained 100. SEO was 60 in the final screenshots
and was outside the requested accessibility/performance remediation
scope.

## 5. WAVE Results

  ----------------------------------------------------------------------------------------
  Page / State    Errors   Contrast    Alerts   Features   Structure      ARIA   AIM Score
                             Errors                                            
  ------------ --------- ---------- --------- ---------- ----------- --------- -----------
  Home `/`         **0**      **0**     **0**          3           3         0   **10/10**

  Work `/work`     **0**      **0**     **0**          3           4         0   **10/10**

  Chat ---         **0**      **0**     **0**          4           3         3   **10/10**
  Empty                                                                        

  Chat ---         **0**      **0**     **1**          4           3         3   **10/10**
  Response +                                                                   
  Lead Score                                                                   
  Card                                                                         
  ----------------------------------------------------------------------------------------

The single alert in the completed chat state was reported by WAVE as a
**Possible heading** requiring manual review. It was not a WAVE Error or
Contrast Error.

## 6. Keyboard-Only Test

A keyboard-only pass was completed on `/chat`.

The test covered: - `Tab` / `Shift+Tab` navigation. - Reaching the
message textarea. - Typing and sending a message. - Navigating during
streamed AI output. - Reaching the **Stop** control while streaming. -
Activating Stop with `Enter`. - Checking visible focus indication and
ensuring focus was not trapped or lost.

**Result: PASS.**

## 7. Final Checklist

-   [x] Lighthouse mobile baseline recorded
-   [x] Accessibility fixes implemented
-   [x] Focus states implemented
-   [x] Form label added
-   [x] Contrast issues fixed
-   [x] Landmark structure corrected
-   [x] Zoom restriction removed
-   [x] Skip link added
-   [x] AI streaming status announced with `aria-live`
-   [x] Keyboard chat flow tested
-   [x] WAVE Home tested
-   [x] WAVE Work tested
-   [x] WAVE Chat empty state tested
-   [x] WAVE Chat completed state tested
-   [x] Lighthouse post-fix results recorded
-   [x] Changes deployed

## Conclusion

The portfolio meets the primary accessibility and performance
requirements for the audit assignment. Lighthouse mobile Performance and
Accessibility scores are above the required threshold on all tested
pages, WAVE reports zero errors and zero contrast errors in the tested
states, and the primary chat flow was successfully completed using
keyboard navigation.
