const storageKeys = {
  customers: 'toxinresin_customers',
  jobs: 'toxinresin_jobs',
  reports: 'toxinresin_reports',
  invoices: 'toxinresin_invoices'
};

const getData = key => JSON.parse(localStorage.getItem(key) || '[]');
const setData = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const customerForm = document.getElementById('customer-form');
const customerList = document.getElementById('customer-list');
const customerEmpty = document.getElementById('customer-empty');
const toggleCustomerFormButton = document.getElementById('toggle-customer-form');
const jobForm = document.getElementById('job-form');
const jobList = document.getElementById('job-list');
const reportForm = document.getElementById('report-form');
const reportPreview = document.getElementById('report-preview');
const alertList = document.getElementById('alert-list');
const invoiceForm = document.getElementById('invoice-form');
const invoiceList = document.getElementById('invoice-list');
const generateAlertsButton = document.getElementById('generate-alerts');

const tabs = Array.from(document.querySelectorAll('.tab'));
const panels = Array.from(document.querySelectorAll('.tab-panel'));

function switchTab(tabName) {
  tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === tabName));
  panels.forEach(panel => panel.classList.toggle('active', panel.id === `tab-${tabName}`));
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

function refreshCustomerState() {
  const customers = getData(storageKeys.customers);
  const hasCustomers = customers.length > 0;
  customerEmpty.classList.toggle('hidden', hasCustomers);
  if (!hasCustomers) {
    customerForm.classList.remove('hidden');
    toggleCustomerFormButton.textContent = 'Hide Form';
  }
}

toggleCustomerFormButton.addEventListener('click', () => {
  customerForm.classList.toggle('hidden');
  toggleCustomerFormButton.textContent = customerForm.classList.contains('hidden') ? 'Create Customer' : 'Hide Form';
});

function renderSelectOptions() {
  const customers = getData(storageKeys.customers);
  [jobForm.customerId, invoiceForm.customerId].forEach(select => {
    select.innerHTML = '<option value="">Select customer</option>';
    customers.forEach(customer => {
      const option = document.createElement('option');
      option.value = customer.id;
      option.textContent = `${customer.name} (${customer.address})`;
      select.append(option);
    });
  });

  const jobs = getData(storageKeys.jobs);
  reportForm.jobId.innerHTML = '<option value="">Select job</option>';
  jobs.forEach(job => {
    const option = document.createElement('option');
    option.value = job.id;
    option.textContent = `${job.description.slice(0, 40)} - ${job.address}`;
    reportForm.jobId.append(option);
  });
}

function renderCustomers() {
  const customers = getData(storageKeys.customers);
  customerList.innerHTML = customers
    .map(
      customer => `<div class="item"><strong>${customer.name}</strong><br>${customer.phone} · ${customer.email}<br>${customer.address}<br>${
        customer.isBusiness
          ? `Business | ABN: ${customer.abn || 'N/A'} | ${customer.businessInfo || 'No extra info'}`
          : 'Residential customer'
      }</div>`
    )
    .join('');

  refreshCustomerState();
}

function renderJobs() {
  const customers = getData(storageKeys.customers);
  const customerById = Object.fromEntries(customers.map(c => [c.id, c]));
  const jobs = getData(storageKeys.jobs);
  jobList.innerHTML = jobs
    .map(job => {
      const customer = customerById[job.customerId];
      return `<div class="item"><strong>${job.description}</strong><br>Customer: ${customer?.name || 'Unknown'}<br>Address: ${job.address}<br>Scheduled: ${new Date(job.scheduledAt).toLocaleString()}</div>`;
    })
    .join('');
}

function renderInvoices() {
  const customers = getData(storageKeys.customers);
  const customerById = Object.fromEntries(customers.map(c => [c.id, c]));
  const invoices = getData(storageKeys.invoices);
  invoiceList.innerHTML = invoices
    .map(invoice => {
      const customer = customerById[invoice.customerId];
      return `<div class="item"><strong>Invoice #${invoice.number}</strong><br>To: ${customer?.name || 'Unknown'}<br>Service: ${invoice.service}<br>Amount: $${invoice.amount.toFixed(
        2
      )}<br>Payment Info: ${invoice.paymentInfo}</div>`;
    })
    .join('');
}

function buildReportPreview(report) {
  const template = document.getElementById('report-template');
  const fragment = template.content.cloneNode(true);
  const setField = (field, value) => {
    const node = fragment.querySelector(`[data-field="${field}"]`);
    if (field === 'photo') {
      node.src = value;
    } else {
      node.textContent = value;
    }
  };
  setField('customer', report.customerName);
  setField('description', report.jobDescription);
  setField('address', report.address);
  setField('completedAt', new Date(report.completedAt).toLocaleString());
  setField('photo', report.photoDataUrl);
  setField('workDone', report.workDone);
  setField('hazards', report.hazards);

  reportPreview.innerHTML = '';
  reportPreview.append(fragment);

  const exportBtn = document.createElement('button');
  exportBtn.type = 'button';
  exportBtn.textContent = 'Export Report as PDF';
  exportBtn.addEventListener('click', () => window.print());
  reportPreview.append(exportBtn);
}

customerForm.addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(customerForm);
  const isBusiness = form.get('isBusiness') === 'on';
  const record = {
    id: uid(),
    name: String(form.get('name')),
    phone: String(form.get('phone')),
    email: String(form.get('email')),
    address: String(form.get('address')),
    isBusiness,
    abn: isBusiness ? String(form.get('abn') || '') : '',
    businessInfo: isBusiness ? String(form.get('businessInfo') || '') : ''
  };
  const customers = getData(storageKeys.customers);
  customers.unshift(record);
  setData(storageKeys.customers, customers);
  customerForm.reset();
  customerForm.classList.add('hidden');
  toggleCustomerFormButton.textContent = 'Create Customer';
  renderCustomers();
  renderSelectOptions();
});

jobForm.addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(jobForm);
  const jobs = getData(storageKeys.jobs);
  jobs.unshift({
    id: uid(),
    customerId: String(form.get('customerId')),
    description: String(form.get('description')),
    address: String(form.get('address')),
    scheduledAt: String(form.get('scheduledAt'))
  });
  setData(storageKeys.jobs, jobs);
  jobForm.reset();
  renderJobs();
  renderSelectOptions();
});

reportForm.addEventListener('submit', async event => {
  event.preventDefault();
  const form = new FormData(reportForm);
  const file = form.get('propertyPhoto');
  const jobId = String(form.get('jobId'));

  const jobs = getData(storageKeys.jobs);
  const customers = getData(storageKeys.customers);
  const job = jobs.find(j => j.id === jobId);
  const customer = customers.find(c => c.id === job?.customerId);

  if (!job || !file || !(file instanceof File)) {
    return;
  }

  const photoDataUrl = await new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });

  const report = {
    id: uid(),
    jobId,
    customerName: customer?.name || 'Unknown customer',
    jobDescription: job.description,
    address: job.address,
    completedAt: new Date().toISOString(),
    workDone: String(form.get('workDone')),
    hazards: String(form.get('hazards')),
    photoDataUrl
  };

  const reports = getData(storageKeys.reports);
  reports.unshift(report);
  setData(storageKeys.reports, reports);
  buildReportPreview(report);
  reportForm.reset();
});

generateAlertsButton.addEventListener('click', () => {
  const jobs = getData(storageKeys.jobs);
  const reports = getData(storageKeys.reports);
  const latestJob = jobs[0];
  const latestReport = reports[0];

  const alerts = [];
  if (latestJob) {
    alerts.push({
      channel: 'Email + SMS',
      message: `Job alert: ${latestJob.description} at ${latestJob.address} (${new Date(latestJob.scheduledAt).toLocaleString()})`
    });
  }
  if (latestReport) {
    alerts.push({
      channel: 'Email + SMS',
      message: `Service report ready for ${latestReport.customerName}, completed ${new Date(
        latestReport.completedAt
      ).toLocaleString()}`
    });
  }

  alertList.innerHTML = alerts.length
    ? alerts.map(alert => `<div class="item"><strong>${alert.channel}</strong><br>${alert.message}</div>`).join('')
    : '<div class="item">No jobs or reports available yet.</div>';
});

invoiceForm.addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(invoiceForm);
  const invoices = getData(storageKeys.invoices);
  invoices.unshift({
    id: uid(),
    number: `TR-${String(invoices.length + 1).padStart(4, '0')}`,
    customerId: String(form.get('customerId')),
    service: String(form.get('service')),
    amount: Number(form.get('amount')),
    paymentInfo: String(form.get('paymentInfo')),
    createdAt: new Date().toISOString()
  });
  setData(storageKeys.invoices, invoices);
  invoiceForm.reset();
  renderInvoices();
});

renderCustomers();
renderJobs();
renderInvoices();
renderSelectOptions();
switchTab('customers');
