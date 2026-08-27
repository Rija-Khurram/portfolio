# Reflection

**Project:** Portfolio Capstone — AI-Enhanced Frontend Application
**Author:** Rija Khurram

---

## What was hardest, and why

The hardest issue was not an issue but a bug that tricked me for some time. The end-to-end test that I have implemented in the Playwright for the chat flow kept passing on my machine, but failed during the CI build with a 30 seconds timeout for the Send button to be enabled.

I went through three iterations of hypothesis in order to understand the root cause:

1. **First guess:** The SSE stream that was mocked in the test was using a broken delimiter, so the client didn’t finish "receiving" the dummy response. I made an adjustment to the format of the mock – the test still failed in CI.
2. **Second guess:**react hydration race condition in timing — perhaps the button was taking longer to render as being disabled in CI vs local environment. I added an explicit `waitFor`/enabled check but it failed anyway.
3. **What actually fixed it:** No more guessing and assumptions on my part, I just looked at the actual logic for the disabled state in `ChatInterface.js` and saw how the AI SDK stream parser was invoked in CI vs locally. The problem was infrastructural, not code-related: CI was invoking Next.js **dev server** (`next dev`), which hydrates noticeably slower under Playwright's automation than a **production build** does. Locally, my machine’s development server had enough speed that the difference in timing did not matter at all. What helped fix the problem was altering the CI-only web server command from `next dev` to `npm run build && npm run start`.

It was easy to implement a quick fix for the code, but the tricky part lay in trying to resist the temptation to go ahead and implement the first “sensible” solution before going any further. Both of the hypotheses were sensible and both were incorrect. Had I stuck with either one of the hypotheses, I would have implemented a flawed solution that was even slower than what I needed.

## What I'd do differently next time

Two things:

1. **Verify against actual evidence before proposing a fix**, rather than matching the symptom to its most common cause. A CI timeout *seems* like a flaky test issue (mocking gone wrong or race condition) – these are the "usual suspects". But the actual logs from the CI and the actual logic for the disabled state of the component were right there in front of me all along!
2. **Check what environment a testing tool is actually running against, earlier — especially in CI.** Instead of asking this question third on the list, I have learned that I should be asking it second only after, "Is it a CI environment?" when a test runs unexpectedly in CI.

## One thing that surprised me

The fact that "it works on my machine" has nothing to do with the fact that the code itself is **incorrect**. In this case, the logic of the chat component was correct all along – the button was indeed being enabled, just not as quickly as expected when working with Playwright against the dev server rather than the release one. This is a perfect example of the fact that a bug report that states "the button never gets enabled" does not necessarily indicate that this is the case.
