# List and grid selection

`selection.js` is a standalone delegated controller. It uses DOM attributes
rather than app names or record routes, so it can later move into a shared module.
Load it once or repeatedly; initialization is idempotent.

- Container: `data-grid-selection`.
- Direct card children: `data-select-card`, with CRUD `array` and `object` attributes.
- Record-opening link: `data-card-open` on the name link, with the normal state/ARIA actions.
- Selected state: `aria-selected="true"` on the card.
- Templates, hidden cards and disabled cards do not participate.

Click the card background to select it alone. Ctrl/Cmd-click toggles a card.
Shift-click selects a range in loaded DOM order; Ctrl/Cmd+Shift adds a range.
Interactive descendants keep their existing behavior. Name links open records.

Arrow keys move focus spatially; Home/End focus the first/last loaded card.
Space toggles, Shift+arrows extend selection, Enter opens the name link,
Ctrl/Cmd+A selects loaded cards, and Escape clears selection. These shortcuts
apply inside the grid and do not intercept editable fields.

Optional header controls inside `.component-list` use `data-selection-all` and
`data-selection-clear`. A `data-selection-summary` containing a
`data-selection-count` shows the loaded selection count. The selection container dispatches a
bubbling `selectionchange` event with `{ selected: Element[], loaded: number }`.

Newly loaded cards start unselected, even after Select all. Replacing a card's
record ID clears its selection. Nothing fetches or selects unloaded records.
Export and Delete query selected cards directly, just as list actions query
checked table rows. This script does not perform CRUD or navigation itself.

Tables opt in with `data-row-selection`. Loaded rows contain a native checkbox
marked `data-select-row`, carrying `array` and `object`; the header checkbox
uses `data-select-all`. Row backgrounds support the same click/modifier/keyboard
selection as cards. Links, buttons and editors retain their behavior.
Checkbox clicks toggle independently; Shift-click applies the checkbox's new
state across the range. Native checkbox keyboard behavior remains available.
The controller synchronizes checked state, row highlighting, `aria-selected`,
and the header checkbox's checked/indeterminate state. Disabled and hidden rows
are excluded. Table Enter opens the row's record link when present.
