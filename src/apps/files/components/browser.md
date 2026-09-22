# File browser and media selection

The shared `/components/profile-img.html` control opens this picker instead of the
native file chooser. Browse existing `files` records first, search by filename,
filter by folder or type, or upload a new file. The Files app supports mixed file
types; image-field selection mode restricts the browser and uploads to images. Selecting existing media does not upload
or copy it. Image controls open the picker in selection mode, created once on first use.

## Destinations

- `/assets/`: packaged website assets; available for selection.
- `/media/avatars/`: default for the shared profile image control.
- `/media/logos/`: APIs, companies, organizations, and sellers.
- `/media/uploads/`: general workspace media.

Set `media-path="/media/logos/"` on an ancestor of the picker button to choose the
initial upload folder. The user can edit it within `/media/`. New files use a UUID
prefix so identical filenames do not overwrite existing media. Folders are logical
file `path` prefixes; opening the picker does not create folder records.

## Field contract

Wrap the target and button in `data-media-field`:

```html
<div data-media-field media-path="/media/logos/">
    <input type="hidden" key="avatar" value-type="json" realtime="true"
        set-value-bubbles="true" data-media-value />
    <button type="button" data-media-open>Choose image</button>
</div>
<script src="/apps/files/components/browser.js"></script>
```

Selection calls `target.setValue(value, false)` to emit a user-originated update
through the existing CRUD field handling. The default value preserves the existing
avatar array shape without embedding image bytes:

```json
[{ "file_id": "file-id", "pathname": "/media/logos/file.svg", "src": "/media/logos/file.svg", "name": "Logo.svg" }]
```

Use `media-value="src"` on the target to receive only the pathname, for example
for an `icon` field. A bubbling `mediaSelected` event exposes the reference in
`event.detail.file`. The picker inherits storage/database scope through the target's
CoCreate data attributes. It does not grant public access or alter file permissions.

The stored `file_id` preserves identity, but consumers currently render `src`;
renaming/moving a referenced file will require reference resolution or updates.
Cancel leaves the field untouched. An uploaded file remains in the library if the
user cancels before selecting it. Only confirmed uploads become selectable.

Existing accessible image files need a root-relative `pathname` to appear. The
library reads metadata, not base64 contents. Upload transfers a data URL into the
file record's `src`; the consuming record stores only the reference. Camera and
external-drive sources are not implemented yet.

## Layout

The main Files app includes `/components/list/header.html` directly and uses the
shared `/components/list/grid.html` and `/components/list/table.html` views.
It uses their existing state, selection, and action handling. The Files sidebar
starts collapsed and opens from the shared header's Files menu button.

`browser.html`, `browser.css`, and `browser.js` currently provide the image-selection
dialog for profile controls, with library browsing and uploads. That dialog is not
the main Files listing. Its selection/upload behavior was checked with mocked CRUD
responses; no real uploads were made during validation.
