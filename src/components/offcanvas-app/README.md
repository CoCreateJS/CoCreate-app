# Modular record views

Apps with form and details views share the offcanvas header, footer, layout,
and JSON editor. Their app-specific files are organized as follows:

- `app.html`: complete offcanvas shell with its header and Details, Edit, and
  JSON panels.
- `components/details.html`: existing read-only record content.
- `components/form.html`: form fields only.
- `create.html`: standalone create shell used by New buttons.

The app shell loads form and details from the app's `components/` directory and
JSON from `/components/offcanvas-app/codearea.html`. Each form owns a
`scrollbar` wrapper around its empty `src` host so fetched content does not
replace the scrollbar structure. Edit, JSON, and create forms own the shared
save/cancel footer.

Record links in card templates and app field definitions target `app.html`.
New buttons target `create.html`; `components/form.html` contains only the
fields. AI messages render their declared views and forms directly instead of
loading an app shell.

The header accepts `{{app.name}}`, replaced by each shell using `value-replace`
and `value-replacement`. Use a token without whitespace because it also forms
panel IDs. Panels use that token for their IDs and `aria-labelledby` references.

Record shells use `.offcanvas-app-shell`, panels use `.offcanvas-app-view`, and
create shells use `.offcanvas-app-create`. Shared `index.css` keeps the header
and footer outside the scrolling content, hides the active view button, and
masks the JSON layers while their view or containing panel is hidden.
App-specific styles should contain only app-specific presentation.

Each content form retains `state-id="offcanvas-app-form"`, `array`, and `object`.
Create actions targeting these forms must write their array and reset state to
`offcanvas-app-form`, including actions that display them in `create-panel`.
Special provisioning screens retain their existing state and entry points.

App-specific scroll containers and widgets may remain inside their content
fragment. The shell-level `scrollbar` wrapper handles the primary form scroll;
shells do not initialize SimpleBar directly.
