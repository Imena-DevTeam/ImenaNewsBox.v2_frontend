"use client";

import { useCallback, useMemo, useState } from "react";
import { Container } from "@/components/layout/Container";
import { TreeControls } from "@/features/tree/components/TreeControls";
import { BioDrawer } from "@/features/tree/components/BioDrawer";
import { TreeCanvas } from "@/features/tree/components/TreeCanvas";
import { TreeList } from "@/features/tree/components/TreeList";
import {
  DEFAULT_PROMOTION,
  HOUSEHOLDS,
  PEOPLE,
  ancestorsOf,
  type Person,
  type Promotion,
} from "@/features/tree/data";

/** The record only covers one promotion so far; the others are honestly empty. */
const PROMOTION_WITH_RECORDS: Promotion = DEFAULT_PROMOTION;

export function TreeExplorer() {
  const [query, setQuery] = useState("");
  const [promotion, setPromotion] = useState<Promotion>(DEFAULT_PROMOTION);
  const [selected, setSelected] = useState<Person | null>(null);

  const hasRecords = promotion === PROMOTION_WITH_RECORDS;

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!hasRecords) return new Set<string>();
    if (!q) return new Set(PEOPLE.map((p) => p.id));
    return new Set(
      PEOPLE.filter((p) =>
        [p.name, p.role, p.subfamily].some((f) => f.toLowerCase().includes(q)),
      ).map((p) => p.id),
    );
  }, [query, hasRecords]);

  const householdOfSelected = selected
    ? HOUSEHOLDS.find((h) => h.people.some((p) => p.id === selected.id))
    : undefined;

  /* The path from the selection back to the first generation, which is what
     the diagram lights and everything else dims against. */
  const litHouseholds = useMemo(
    () =>
      householdOfSelected
        ? new Set(ancestorsOf(householdOfSelected.id))
        : new Set<string>(),
    [householdOfSelected],
  );

  const select = (person: Person | null) => setSelected(person);
  const close = useCallback(() => setSelected(null), []);

  return (
    /* The anchor the member footer's subfamily chips land on; scroll-mt
       keeps it clear of the sticky navbar. */
    <Container id="family-tree" className="relative scroll-mt-28">
      <TreeControls
        query={query}
        onQuery={setQuery}
        promotion={promotion}
        onPromotion={(p) => {
          setPromotion(p);
          setSelected(null);
        }}
        resultCount={matches.size}
      />

      {hasRecords ? (
        <>
          {/* The canvas, at every width: wheel or pinch to zoom, drag to
              pan, so a phone can explore it as well as a desktop. */}
          <div className="mt-10">
            <TreeCanvas
              selectedId={selected?.id ?? null}
              onSelect={select}
              litHouseholds={litHouseholds}
              matches={matches}
              dimOthers={query.trim().length > 0}
            />
          </div>

          <p className="text-body-sm text-muted mt-6 text-center">
            Scroll or pinch to zoom, drag to move around, and choose anyone to
            light their line back to the first generation.
          </p>

          <div className="mx-auto mt-12 max-w-3xl md:mt-16">
            <h3 className="text-h4-m md:text-h4 text-center">Everyone here</h3>
            <div className="mt-8">
              <TreeList
                selectedId={selected?.id ?? null}
                onSelect={select}
                matches={matches}
                query={query}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="border-border bg-band mx-auto mt-10 max-w-xl rounded-md border px-6 py-12 text-center">
          <p className="text-h4-m md:text-h4">Nothing recorded yet</p>
          <p className="text-body text-muted mx-auto mt-3 max-w-sm">
            The {promotion} promotion has not been entered into the family
            record. {PROMOTION_WITH_RECORDS} is the one to look at for now.
          </p>
          <button
            type="button"
            onClick={() => setPromotion(PROMOTION_WITH_RECORDS)}
            className="text-ui text-primary transition-base mt-6 inline-flex items-center gap-2 hover:gap-3"
          >
            Show {PROMOTION_WITH_RECORDS}
          </button>
        </div>
      )}

      <BioDrawer
        person={selected}
        householdId={householdOfSelected?.id ?? null}
        onClose={close}
      />

      {/* Said plainly, because unlabelled stand-ins read as an unfinished
          page rather than a waiting one. */}
      <p className="text-caption text-muted mt-12 text-center">
        These are sample records. Portraits and names arrive as the family
        register is filled in.
      </p>
    </Container>
  );
}
