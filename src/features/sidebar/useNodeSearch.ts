import { useMemo, useState } from 'react';
import type { NodeCategory, NodeTypeDescriptor } from '@/shared/types';
import { NODE_CATEGORIES } from '@/shared/types';
import { NODE_DESCRIPTORS, CATEGORY_LABELS } from '@/shared/constants';

/** A category section of the node library with its matching descriptors. */
export type NodeLibraryGroup = {
  category: NodeCategory;
  label: string;
  items: NodeTypeDescriptor[];
};

type UseNodeSearch = {
  query: string;
  setQuery: (value: string) => void;
  groups: NodeLibraryGroup[];
  resultCount: number;
};

function matches(descriptor: NodeTypeDescriptor, needle: string): boolean {
  const haystack =
    `${descriptor.label} ${descriptor.description}`.toLowerCase();
  return haystack.includes(needle);
}

/**
 * Filters the node library by a search query and groups the results by
 * category (in canonical order). Empty categories are dropped from the result.
 */
export function useNodeSearch(): UseNodeSearch {
  const [query, setQuery] = useState('');

  const groups = useMemo<NodeLibraryGroup[]>(() => {
    const needle = query.trim().toLowerCase();
    const filtered = needle
      ? NODE_DESCRIPTORS.filter((d) => matches(d, needle))
      : NODE_DESCRIPTORS;

    return NODE_CATEGORIES.map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      items: filtered.filter((d) => d.category === category),
    })).filter((group) => group.items.length > 0);
  }, [query]);

  const resultCount = useMemo(
    () => groups.reduce((sum, g) => sum + g.items.length, 0),
    [groups],
  );

  return { query, setQuery, groups, resultCount };
}
