// CAREER PORTAL JS (self-contained)
(function(){
  // sample jobs — replace with real data from backend or JSON
  const jobs = [
    { id: 1, title: "Project Manager", dept: "Engineering", type: "Full-time",
      location: "Remote / Kochi", summary: "Lead our team of project managers to ensure timely delivery and quality." },
    { id: 2, title: "Project Engineer", dept: "Engineering", type: "Full-time",
      location: "On-site / Kerala", summary: "Designs from concept to completion, ensuring structural integrity and compliance." },
    { id: 3, title: "Site Supervisor", dept: "Supervising", type: "Contract",
      location: "Hybrid", summary: "Oversees daily site operations, ensuring safety and adherence to plans." },
    { id: 4, title: "Manager", dept: "Manager", type: "Full-time",
      location: "Field", summary: "Manage the worksites and drive revenue growth." },
    { id: 5, title: "Store Keeper", dept: "Storekeeping", type: "Intern",
      location: "On-site", summary: "Support the company by keeping inventory organized and up-to-date." }
  ];

  const $jobsList = document.getElementById('jobs-list');
  const $noJobs = document.getElementById('no-jobs');
  const $dept = document.getElementById('job-dept');
  const $type = document.getElementById('job-type');
  const $clear = document.getElementById('clear-filters');

  // render function
  function render(list) {
    $jobsList.innerHTML = '';
    if(!list.length){
      $noJobs.classList.remove('d-none');
      return;
    }
    $noJobs.classList.add('d-none');

    list.forEach(j => {
      const col = document.createElement('div');
      col.className = 'col-lg-4 col-md-6 mb-4';
      col.innerHTML = `
        <div class="job-card">
          <div>
            <div class="job-meta">${j.location} • <span class="defaultcolor">${j.type}</span></div>
            <div class="job-title">${j.title}</div>
            <div class="job-badges">
              <span class="badge">${j.dept}</span>
              <span class="badge">${j.type}</span>
            </div>
            <div class="job-desc">${j.summary}</div>
          </div>
          <div class="job-footer">
            <div class="text-muted small">Ref #${j.id}</div>
            <div class="ms-auto">
              <button class="button btnsecondary btn-sm me-2 view-job" data-id="${j.id}">View</button>
              <button class="button btn-primary job-apply" data-id="${j.id}">Apply</button>
            </div>
          </div>
        </div>
      `;
      $jobsList.appendChild(col);
    });

    // attach handlers
    document.querySelectorAll('.view-job').forEach(btn => {
      btn.addEventListener('click', e => {
        const job = jobs.find(x => x.id == e.currentTarget.dataset.id);
        showDetails(job);
      });
    });
    document.querySelectorAll('.job-apply').forEach(btn => {
      btn.addEventListener('click', e => {
        const job = jobs.find(x => x.id == e.currentTarget.dataset.id);
        openApply(job);
      });
    });
  }

  function showDetails(job){
    // lightweight detail popup using Bootstrap modal
    const modalHtml = `
      <div class="modal fade" id="detailModalTemp" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bglight">
              <h5 class="modal-title">${job.title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <p><strong>Department:</strong> ${job.dept}</p>
              <p><strong>Type:</strong> ${job.type}</p>
              <p><strong>Location:</strong> ${job.location}</p>
              <p>${job.summary}</p>
              <p><strong>Responsibilities:</strong></p>
              <ul>
                <li>Deliver high quality work</li>
                <li>Collaborate with cross-functional teams</li>
                <li>Maintain documentation & timelines</li>
              </ul>
            </div>
            <div class="modal-footer">
              <button class="button btnsecondary" data-bs-dismiss="modal">Close</button>
              <button class="button btn-primary" id="openApplyFromDetails" data-id="${job.id}">Apply</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const myModal = new bootstrap.Modal(document.getElementById('detailModalTemp'));
    myModal.show();

    document.getElementById('detailModalTemp').addEventListener('hidden.bs.modal', function(){
      document.getElementById('detailModalTemp').remove();
    });

    // open apply from details
    document.getElementById('openApplyFromDetails').addEventListener('click', (e)=>{
      myModal.hide();
      const jobId = e.currentTarget.dataset.id;
      const jobObj = jobs.find(x => x.id == jobId);
      openApply(jobObj);
    });
  }

  function openApply(job){
    document.getElementById('applyJobId').value = job.id;
    document.getElementById('applyJobTitle').textContent = 'Apply — ' + job.title;
    // reset form
    document.getElementById('applyForm').reset();
    document.getElementById('apply-status').classList.add('d-none');
    const applyModal = new bootstrap.Modal(document.getElementById('applyModal'));
    applyModal.show();
  }

  // apply form submission (mock)
  document.getElementById('applyForm').addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('app-name').value.trim();
    const email = document.getElementById('app-email').value.trim();
    const resume = document.getElementById('app-resume').files[0];

    if(!name || !email || !resume){
      showApplyStatus('Please fill name, email and attach resume.', 'danger');
      return;
    }
    if(resume.size > 5*1024*1024){
      showApplyStatus('Resume exceeds 5MB limit.', 'danger');
      return;
    }
    // show a success (in real site, upload via AJAX to backend)
    showApplyStatus('Application submitted. We will contact you within 5 working days.', 'success');

    // optionally close modal after a moment:
    setTimeout(()=> {
      const modalEl = document.getElementById('applyModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      if(modal) modal.hide();
    }, 1800);
  });

  function showApplyStatus(message, type){
    const el = document.getElementById('apply-status');
    el.className = '';
    el.classList.add('mt-3','alert');
    el.classList.add(type === 'success' ? 'alert-success' : 'alert-danger');
    el.textContent = message;
    el.classList.remove('d-none');
  }

  // filter logic
  function applyFilters(){
    const d = $dept.value;
    const t = $type.value;
    const filtered = jobs.filter(j => (d === '*' || j.dept === d) && (t === '*' || j.type === t));
    render(filtered);
  }

  $dept.addEventListener('change', applyFilters);
  $type.addEventListener('change', applyFilters);
  $clear.addEventListener('click', function(){
    $dept.value = '*';
    $type.value = '*';
    applyFilters();
  });

  // initial render
  render(jobs);

})();
