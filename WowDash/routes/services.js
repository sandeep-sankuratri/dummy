const express = require('express');
const router = express.Router();

router.get('/itr-individual', (req, res) => {
    res.render('services/itrIndividualFiling', {
        title: 'ITR Individual Filing',
        subTitle: 'Services - ITR Individual Filing',
        hideBreadcrumb: true,
        navbarCenter: `
<div id="itrNavChips" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;flex:1;min-width:0;">
    <span style="font-size:.68rem;color:#94a3b8;">Loading…</span>
</div>
<div style="flex-shrink:0;width:1px;height:28px;background:#e2e8f0;margin:0 2px;"></div>
<button type="button" onclick="window.openAssignModal && window.openAssignModal()"
    class="btn btn-primary d-inline-flex align-items-center gap-4"
    style="height:34px;padding:0 14px;white-space:nowrap;font-size:.75rem;border-radius:8px;flex-shrink:0;">
    <iconify-icon icon="ic:baseline-plus" style="font-size:.9rem;"></iconify-icon>Assign Client
</button>`
    });
});

router.get('/itr-individual/:id', (req, res) => {
    res.render('services/itrFilingDetail', {
        title: 'ITR Filing Detail',
        subTitle: 'Services - ITR Individual Filing - Detail',
        filingId: req.params.id,
        hideBreadcrumb: true,
        navbarHideTitle: true,
        navbarCenter: `
<div style="flex:1;min-width:0;display:flex;align-items:center;gap:10px;">

  <!-- Left: title row + rdStrip stacked -->
  <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:5px;">
    <div class="d-flex align-items-center gap-8 flex-wrap" style="min-width:0;">
      <h6 class="fw-bold mb-0" style="font-size:.88rem;line-height:1.2;" id="pageHeaderTitle">ITR Filing</h6>
      <span id="headerFyBadge" class="badge text-xs fw-semibold px-8 radius-6 d-none"
            style="background:#e8f0fe;color:#2563eb;white-space:nowrap;padding-top:2px;padding-bottom:2px;"></span>
      <span class="d-flex align-items-center gap-4 flex-wrap">
        <span class="text-secondary-light text-xs d-none" id="hdr_caller_wrap">
          <span class="mx-4" style="color:#cbd5e1;">·</span>Caller:
          <span id="hdr_caller" class="fw-semibold text-primary-light ms-1">—</span>
        </span>
        <span class="text-secondary-light text-xs d-none" id="hdr_preparer_wrap">
          <span class="mx-4" style="color:#cbd5e1;">·</span>Preparer:
          <span id="hdr_preparer_view" class="fw-semibold text-primary-light ms-1">—</span>
          <select id="hdr_preparer_edit" class="form-control radius-6 form-select text-xs d-none ms-1"
                  style="height:26px;padding:1px 8px;max-width:170px;display:inline-block;vertical-align:middle;"></select>
        </span>
        <span class="text-secondary-light text-xs d-none" id="hdr_manager_wrap">
          <span class="mx-4" style="color:#cbd5e1;">·</span>Manager:
          <span id="hdr_manager" class="fw-semibold text-primary-light ms-1">—</span>
        </span>
      </span>
    </div>
    <div id="rdStrip" class="d-none align-items-center gap-8 flex-wrap" style="font-size:.72rem;"></div>
  </div>

  <!-- Right: Save / Cancel / Back — vertically centered to the full column height -->
  <div class="d-flex align-items-center gap-6 flex-shrink-0">
    <button id="hdr_saveBtn" class="btn btn-primary text-xs px-10 py-2 radius-6 d-none"
            style="height:26px;line-height:1;">Save</button>
    <button id="hdr_cancelBtn" class="btn text-xs px-10 py-2 radius-6 d-none"
            style="background:#fee2e2;color:#dc2626;border:none;height:26px;line-height:1;">Cancel</button>
    <span id="hdr_editError" class="text-danger-600 text-xs d-none"></span>
    <a href="/services/itr-individual"
       class="btn btn-outline-secondary-600 text-xs px-10 py-6 radius-8 d-flex align-items-center gap-2">
      <iconify-icon icon="ep:d-arrow-left" class="text-sm"></iconify-icon>Back
    </a>
  </div>

</div>
`
    });
});

module.exports = router;
