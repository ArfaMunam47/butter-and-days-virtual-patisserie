<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- The boutique is a single interactive scene: `src/routes/index.tsx` owns all cart/drag state; presentational components live in `src/components/bakery/`, product data in `src/data/products.ts`. Why: the brief is one viewport scene, not a multi-page shop.
- Drag-and-drop is hand-rolled with pointer events plus `motion` (no drag library). Why: needs custom ghost, spring-back, and tap-to-add behavior the libraries don't give.
- Pure frontend, no backend: cart lives in React state; checkout is an explicit demo (never fake a payment success). Why: the brief asks for a demo boutique.
