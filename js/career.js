// CAREER PORTAL JS (Web3Forms integrated)
(function () {
  // sample jobs — replace with real data from backend or JSON
  const jobs = [
    {
      id: 1,
      title: "Project Manager",
      dept: "Engineering",
      type: "Full-time",
      location: "Remote / Kochi",
      summary: "Lead our team of project managers to ensure timely delivery and quality."
    },
    {
      id: 2,
      title: "Project Engineer",
      dept: "Engineering",
      type: "Full-time",
      location: "On-site / Kerala",
      summary: "Designs from concept to completion, ensuring structural integrity and compliance."
    },
    {
      id: 3,
      title: "Site Supervisor",
      dept: "Supervising",
      type: "Contract",
      location: "Hybrid",
      summary: "Oversees daily site operations, ensuring safety and adherence to plans."
    },
    {
      id: 4,
      title: "Manager",
      dept: "Manager",
      type: "Full-time",
      location: "Field",
      summary: "Manage the worksites and drive revenue growth."
    },
    {
      id: 5,
      title: "Store Keeper",
      dept: "Storekeeping",
      type: "Intern",
      location: "On-site",
      summary: "Support the company by keeping inventory organized and up-to-date."
    }
  ];

  const $jobsList = document.getElementById("jobs-list");
  const $noJobs = document.getElementById("no-jobs");
  const $dept = document.getElementById("job-dept");
  const $type = document.getElementById("job-type");
  const $clear = document.getElementById("clear-filters");

  // ---------- INITIALIZE LISTENERS ----------
  function init() {
    // Attach events to static buttons
    document.querySelectorAll(".view-job").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        const job = jobs.find((x) => x.id == id);
        showDetails(job);
      });
    });

    document.querySelectorAll(".job-apply").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        const job = jobs.find((x) => x.id == id);
        openApply(job);
      });
    });
  }

  // ---------- VIEW DETAILS MODAL ----------
  function showDetails(job) {
    if(!job) return;
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

    document.body.insertAdjacentHTML("beforeend", modalHtml);

    const myModal = new bootstrap.Modal(document.getElementById("detailModalTemp"));
    myModal.show();

    document.getElementById("detailModalTemp").addEventListener("hidden.bs.modal", function () {
      document.getElementById("detailModalTemp").remove();
    });

    document.getElementById("openApplyFromDetails").addEventListener("click", (e) => {
      myModal.hide();
      const jobId = e.currentTarget.dataset.id;
      const jobObj = jobs.find((x) => x.id == jobId);
      openApply(jobObj);
    });
  }

  // ---------- OPEN APPLY MODAL ----------
  function openApply(job) {
    if(!job) return;
    document.getElementById("applyJobId").value = job.id;
    document.getElementById("applyJobTitle").textContent = "Apply — " + job.title;

    // IMPORTANT — send job title to Web3Forms
    document.getElementById("applyJobTitleField").value = job.title;

    document.getElementById("applyForm").reset();
    document.getElementById("apply-status").classList.add("d-none");

    const applyModal = new bootstrap.Modal(document.getElementById("applyModal"));
    applyModal.show();
  }

  // ---------- SUBMIT APPLICATION (Web3Forms) ----------
  document.getElementById('applyForm').addEventListener('submit', async function(e){
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Send to Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
    });

    const result = await response.json();

    const statusBox = document.getElementById("apply-status");

    if (response.status === 200 && result.success) {
        statusBox.className = "alert alert-success mt-3";
        statusBox.textContent = "Your application has been submitted successfully.";
        statusBox.classList.remove("d-none");

        setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById("applyModal"));
            modal.hide();
        }, 1500);

        form.reset();
    } else {
        statusBox.className = "alert alert-danger mt-3";
        statusBox.textContent = "Submission failed. Try again later.";
        statusBox.classList.remove("d-none");
    }
  });


  function showApplyStatus(message, type) {
    const el = document.getElementById("apply-status");
    el.className = "";
    el.classList.add("mt-3", "alert");

    if (type === "success") el.classList.add("alert-success");
    else if (type === "danger") el.classList.add("alert-danger");
    else el.classList.add("alert-primary");

    el.textContent = message;
    el.classList.remove("d-none");
  }

  // ---------- FILTERS ----------
  function applyFilters() {
    const d = $dept.value;
    const t = $type.value;
    
    // Select all job items
    const jobItems = document.querySelectorAll("#jobs-list > div");
    let visibleCount = 0;

    jobItems.forEach(item => {
        const itemDept = item.getAttribute('data-dept');
        const itemType = item.getAttribute('data-type');
        
        const deptMatch = (d === "*" || itemDept === d);
        const typeMatch = (t === "*" || itemType === t);
        
        if (deptMatch && typeMatch) {
            item.classList.remove('d-none');
            visibleCount++;
        } else {
            item.classList.add('d-none');
        }
    });

    if (visibleCount === 0) {
        $noJobs.classList.remove("d-none");
    } else {
        $noJobs.classList.add("d-none");
    }
  }

  $dept.addEventListener("change", applyFilters);
  $type.addEventListener("change", applyFilters);

  $clear.addEventListener("click", () => {
    $dept.value = "*";
    $type.value = "*";
    applyFilters();
  });

  // initial setup
  init();
})();
