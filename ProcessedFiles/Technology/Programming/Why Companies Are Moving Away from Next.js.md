---
title: Why Companies Are Moving Away from Next.js
tags: Programming
createdAt: Sat Mar 29 2025 19:16:28 GMT-0400 (Atlantic Standard Time)
updatedAt: Sat Mar 29 2025 19:16:28 GMT-0400 (Atlantic Standard Time)
---



## Performance Issues and Industry Concerns
- Several companies have recently announced troubles with [[Next.js]], a framework that was once the preferred choice for React developers due to its promise of performance, SEO benefits, and a streamlined [[User experience | developer experience]], but is now being reconsidered or abandoned altogether.
- The framework's marketing promises, such as static [[Distributed generation | site generation]], [[Server-side scripting | server-side rendering]], and built-in optimizations, have not translated to real-world performance, with companies like Northflank experiencing significant performance bottlenecks, including slow page renders and crashes, despite using a content delivery network (CDN).
- Northflank's tests comparing Next.js to a custom-built React SSR solution showed massive improvements, with the first contentful paint getting four times faster and the speed index reducing from 8.4 seconds to 1.7 seconds, highlighting Next.js's inefficiencies and the impact on SEO performance, which was expected to be a major strength of the framework.
- Industry-wide, companies are moving away from Next.js due to its sluggish performance at scale, with developers like Eduardo Bouças raising concerns about the framework's governance, security mismanagement, and proprietary dependencies, which limit portability and competition.

## Shifting Philosophies and Developer Frustration
- The constant changes in Next.js's philosophy, including shifts from [[JAMstack | Jamstack]] and static site generation to serverless and back to server-side rendering, and now towards microVMs, have left developers feeling like they're chasing a moving target and have led to frustration and exhaustion, with many comparing it to the chaotic history of React Router.
- The introduction of the App Router in [[Next.js]] has only reinforced this sentiment, and developers are now making informed choices about using the framework, considering its limitations and the potential consequences, such as slow page renders, crashes, and negative impacts on SEO performance, as experienced by Northflank, which saw its SEO performance drop significantly due to [[Google]] penalizing its slow-loading pages.
- The Next.js framework is being criticized by developers for unnecessarily reinventing itself and complicating the process of rendering React applications, with some experiencing significant delays of six to seven seconds when seeing changes in the browser during development.

## Technical Issues and Vendor Lock-in Concerns
- Beyond technical issues, there is growing skepticism around Next.js's relationship with [[Vercel]], with some developers believing that the framework has been engineered to push users toward Vercel's hosting services, making self-hosting more difficult and raising concerns about vendor lock-in and conflicts of interest.
- The [[User experience | developer experience]] with Next.js has been negatively impacted, with slow hot module reloading, delays in recompilation, and frustratingly slow development, leading some developers to switch to alternatives like [[Vite (software) | Vite]], Remix, or custom SSR solutions to regain control over performance and developer experience.

## Remaining Advantages and Counterarguments
- Despite these criticisms, [[Next.js]] still has its defenders, who appreciate its conventions around routing, built-in API routes, and [[TypeScript]] support, and argue that it streamlines full-stack development by keeping frontend and backend logic in the same project.

## Declining Justification and Growing Criticism
- However, for companies that prioritize performance, stability, and long-term maintainability, Next.js is becoming harder to justify, with some developers feeling that it has become too complex and is no longer the best choice, and is instead entering a phase where it is seen as "terrible" due to its limitations and drawbacks.


## Sources
- [website](https://analyticsindiamag.com/ai-features/why-companies-are-moving-away-from-next-js/)
- [alias](why_companies_are_moving_away_from_next.js)
