# FAQCategories

Right-pane widget showing the top 5 FAQ category tags fetched from the DB. Used in the Dashboard page sidebar. Supports single or multi-select filtering.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `categories` | `Array<{ tag: string, count: number }>` | `[]` | Full list of tag/count pairs from `GET /api/questions/tags` |
| `selected` | `string[]` | `[]` | Tags currently selected in the filter |
| `onToggle` | `function` | — | Called with a tag string when a row is clicked |
| `onClear` | `function` | — | Clears all selected tags |

## Behaviour

- Shows up to **5 tags** from `categories` (via `.slice(0, 5)`)
- **Multi-select**: clicking a row calls `onToggle(tag)` — parent decides whether to add or remove
- **Clear button**: appears (×) next to the "Top FAQ Categories" heading when `selected.length > 0`
- Empty state: `"No categories yet."`

## Visual Design

- Container: white card, `rounded-xl border border-[#c4c7c7]`, padding `p-6`
- Icon: `TrendingUp` (lucide) in `#8c6a40` background
- Rows: numbered `01`–`05` in `#9ca3af`, label in `capitalize`, count badge
- Selected row: left accent in `#8c6a40`, text `#8c6a40`, subtle `#8c6a40/10` background
- Hover: `#f3f4f6` background

## Data Flow

```
fetchQuestionTags() → categories prop → FAQCategories
                                         ↓
                              DashboardPage: activeTags state
                                         ↓
                                    loadQuestions({ tag: activeTags.join(',') })
```

## Notes

- Tags come from the `GET /api/questions/tags` endpoint (distinct tags across published community questions)
- "Top" means first 5 by insertion order from the API — no ranking applied here
- Tag text uses CSS `capitalize` for display
