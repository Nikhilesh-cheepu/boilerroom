"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { HomeMenus } from "@/lib/data/home-page";
import type { MenuCategory } from "@/lib/content/site";
import {
  buildCartOrderWhatsAppMessage,
  buildWhatsAppHref,
  parsePriceToNumber,
} from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { type MenuKind, useMenuCart } from "./menu-cart-context";

const KINDS: { id: MenuKind; label: string }[] = [
  { id: "food", label: "Food" },
  { id: "beverage", label: "Beverage" },
  { id: "happyhours", label: "Happy hours" },
];

function categoriesForKind(menus: HomeMenus, kind: MenuKind): MenuCategory[] {
  return menus[kind];
}

export function MenuCartSection({
  menus,
  whatsappE164,
}: {
  menus: HomeMenus;
  whatsappE164: string;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const { lines, addOne, removeOne, totalQty } = useMenuCart();
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeKind, setActiveKind] = useState<MenuKind>("food");

  const categories = useMemo(
    () => categoriesForKind(menus, activeKind),
    [menus, activeKind],
  );

  const totalAmount = useMemo(
    () =>
      lines.reduce((s, l) => s + parsePriceToNumber(l.price) * l.qty, 0),
    [lines],
  );

  const openWithKind = (kind: MenuKind) => {
    setActiveKind(kind);
    setPanelOpen(true);
  };

  const checkoutHref = useMemo(() => {
    const msg = buildCartOrderWhatsAppMessage(
      lines.map((l) => ({
        name: l.name,
        qty: l.qty,
        unitPriceLabel: l.price,
      })),
    );
    return buildWhatsAppHref(whatsappE164, msg);
  }, [lines, whatsappE164]);

  return (
    <section
      id="menu"
      className="relative scroll-mt-20 bg-[#070b12] py-10 sm:py-12"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-5">
        <motion.header
          className="mb-7 text-left sm:mb-8"
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-1 text-[10px] font-medium tracking-[0.22em] text-[#9ca6c6]/60 sm:text-[11px]">
            Order
          </p>
          <h2 className="font-display text-[2rem] font-semibold tracking-tight text-[#f3f5fd] sm:text-[2.2rem] md:text-[2.45rem]">
            Menu
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#b6bfd9]/75">
            We are currently updating our menu. Please call us for the most accurate menu and pricing.
          </p>
        </motion.header>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {KINDS.map((k, i) => (
            <motion.button
              key={k.id}
              type="button"
              onClick={() => openWithKind(k.id)}
              initial={false}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                delay: reduceMotion ? 0 : 0.06 + i * 0.07,
                type: "spring",
                stiffness: 380,
                damping: 28,
              }}
              whileHover={reduceMotion ? undefined : { y: -4, scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              className={cn(
                "group relative overflow-hidden rounded-xl border px-2 py-2 text-center sm:px-2.5 sm:py-2.5",
                "border-[#cad6ff2e] bg-[#0c1320]",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_8px_18px_-14px_rgba(0,0,0,0.6)]",
                "hover:border-[#dde7ff50] hover:bg-[#0f1828]",
                activeKind === k.id &&
                  panelOpen &&
                  "border-[#c8d7ff80] bg-[#bacbff1f] shadow-[0_0_0_1px_rgba(191,208,255,0.28)]",
              )}
            >
              <span
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(191,208,255,0.17) 0%, transparent 55%)",
                }}
              />
              <span className="relative font-display text-[0.94rem] font-semibold tracking-[0.03em] text-[#f3f5fd] sm:text-[0.98rem]">
                {k.label}
              </span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence initial={false}>
          {panelOpen ? (
            <>
              <motion.button
                type="button"
                aria-label="Close menu overlay"
                className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-[1px]"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                onClick={() => setPanelOpen(false)}
              />
              <motion.div
              key="menu-panel"
              initial={reduceMotion ? undefined : { y: "-110%", opacity: 0.92 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduceMotion ? undefined : { y: "-110%", opacity: 0.92 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 36,
                mass: 0.85,
              }}
              className="fixed inset-x-0 top-0 z-[70] max-h-[92dvh] overflow-hidden rounded-b-2xl border-b border-[#3d3429]/90 bg-[#0c0a09]/95 shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
            >
              <div className="border-b border-[#3d3429]/80 bg-gradient-to-b from-[#161311] to-[#0e0c0b]">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
                  <div
                    className="flex flex-wrap gap-2"
                    role="tablist"
                    aria-label="Menu type"
                  >
                    {KINDS.map((k) => (
                      <button
                        key={k.id}
                        type="button"
                        role="tab"
                        aria-selected={activeKind === k.id}
                        onClick={() => setActiveKind(k.id)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition",
                          activeKind === k.id
                            ? "border-[#c9a227]/60 bg-[#2a241c] text-[#f5ead8]"
                            : "border-[#4a3f35]/80 bg-transparent text-[#9a8a78] hover:border-[#6b5d4f]",
                        )}
                      >
                        {k.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 text-[#c4b5a0]">
                      <ShoppingBag className="h-5 w-5 text-[#c9a227]" />
                      <span className="text-sm">
                        <span className="font-semibold text-[#f0e6d8]">
                          {totalQty}
                        </span>{" "}
                        items
                      </span>
                    </div>
                    <div className="text-sm text-[#b8a995]">
                      Total{" "}
                      <span className="font-semibold text-[#f5ead8]">
                        ₹{totalAmount.toFixed(0)}
                      </span>
                    </div>
                    <a
                      href={checkoutHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex items-center justify-center rounded-full border border-[#8b6914]/60 bg-gradient-to-b from-[#4a3d2e] to-[#2e261c] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#f5ead8] shadow-lg transition hover:border-[#c9a227]/70 sm:px-5",
                        totalQty === 0 && "pointer-events-none opacity-40",
                      )}
                    >
                      Checkout
                    </a>
                    <button
                      type="button"
                      onClick={() => setPanelOpen(false)}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#4a3f35] text-[#c4b5a0] transition hover:border-[#6b5d4f] hover:text-[#f0e6d8]"
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>

                {lines.length > 0 ? (
                  <ul className="mx-auto w-full max-w-6xl space-y-2 border-t border-[#2a241c] px-4 py-3 sm:px-5">
                    {lines.map((l) => (
                      <li
                        key={l.key}
                        className="flex items-center justify-between gap-3 text-sm text-[#d4c9b8]"
                      >
                        <span className="min-w-0 flex-1 truncate">
                          <span className="text-[#8b7355]">{l.categoryLabel}</span>{" "}
                          · {l.name}{" "}
                          <span className="text-[#a08f7a]">×{l.qty}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeOne(l.key)}
                          className="shrink-0 rounded-full border border-[#4a3f35] p-1.5 text-[#c9a227] hover:bg-[#1f1b17]"
                          aria-label={`Remove one ${l.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mx-auto max-h-[min(68dvh,700px)] w-full max-w-6xl space-y-8 overflow-y-auto px-4 pb-6 pt-2 sm:px-5">
                  {categories.length === 0 ? (
                    <p className="py-8 text-center text-sm text-[#7a6b5c]">
                      No items in this menu yet — check back soon.
                    </p>
                  ) : (
                    categories.map((cat) => (
                      <div key={cat.id}>
                        <h3 className="mb-3 font-display text-lg font-semibold uppercase tracking-wide text-[#d4c4a8]">
                          {cat.label}
                        </h3>
                        <ul className="space-y-2">
                          {cat.items.map((item) => (
                            <li
                              key={item.id}
                              className="flex items-start justify-between gap-3 rounded-xl border border-[#2e2820]/90 bg-[#12100e]/80 px-3 py-3 sm:px-4"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-[#ebe3d7]">
                                  {item.name}
                                </p>
                                {item.note ? (
                                  <p className="mt-0.5 text-xs text-[#8b7d6c]">
                                    {item.note}
                                  </p>
                                ) : null}
                                <p className="mt-1 text-sm font-semibold text-[#c9a227]">
                                  {item.price}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  addOne({
                                    menuKind: activeKind,
                                    category: cat,
                                    itemId: item.id,
                                    name: item.name,
                                    price: item.price,
                                  })
                                }
                                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#6b5344] bg-[#1f1b17] text-[#f5ead8] transition hover:border-[#c9a227]/60 hover:bg-[#2a241c]"
                                aria-label={`Add ${item.name}`}
                              >
                                <Plus className="h-5 w-5" strokeWidth={2.5} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>

        {!panelOpen ? null : null}
      </div>
    </section>
  );
}
