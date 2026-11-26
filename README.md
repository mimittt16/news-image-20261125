# The World in One Day — Wednesday, 25 November 2026

One image summing up the world's news of Wednesday, 25 November 2026, for the
[make.fun news-image-20261125 bounty](https://make.fun/bounty/news-image-20261125).

## The six stories

1. **War · Ukraine** — Russian strikes hit Ukraine's power and gas sites, cutting
   power in five regions.
2. **Conflict · Saudi Arabia** — Houthis strike the Ras Tanura refinery and
   Riyadh's financial district.
3. **Trade · Washington** — The US proposes tariffs on 14 trading partners.
4. **Markets · Asia** — Asian stocks slide as the AI rally fizzles; Nikkei −2.9%.
5. **Courts · Baghdad** — Iraq's top court lets Baghdad send troops to Kurdish
   borders.
6. **Sport · Madrid** — Real Madrid hit five past PSV; Arsenal and Man City are held.

Footer: World Chess Championship, Game 1 — Gukesh holds Sindarov to a draw in
Geneva. Sources: Reuters.

## How it works

`main.ts` (Node 22, standard library only) validates `entry.png` as a whole PNG
(signature, 1024×1024 IHDR, every chunk's CRC32, exact end at IEND) and copies it
to `$MAKEFUN_OUTPUT_DIR/entry.png`.

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```
