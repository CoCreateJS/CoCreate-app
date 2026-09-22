# Modular record views

Apps with form and details views share the offcanvas header, footer, layout,
and JSON editor. Their app-specific files are organized as follows:

- `aside.html`: record shell with Details, Edit, and JSON panels.
- `components/details.html`: existing read-only record content.
- `components/form.html`: existing fields with the shared save/cancel footer.
- `create.html`: standalone create shell used by New buttons.

The aside loads form and details directly from the app's `components/` directory
and JSON directly from `/components/offcanvas-app/codearea.html`.

Record links in card templates and app field definitions target `aside.html`.
New buttons target `create.html`; the only `form.html` contains the fields in `components/`. There are no root details or JSON
wrappers; record links use `aside.html`.

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

Existing scroll containers and widgets stay inside their app's content
fragment. Shell onload attributes initialize SimpleBar for forms with a direct
`.card-body`; forms with their own scroll container retain their own plugin.
