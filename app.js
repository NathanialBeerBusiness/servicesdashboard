const storageKeys = {
  customers: 'toxinresin_customers',
  jobs: 'toxinresin_jobs',
  reports: 'toxinresin_reports',
  invoices: 'toxinresin_invoices',
  messages: 'toxinresin_messages'
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
const reportList = document.getElementById('report-list');
const alertList = document.getElementById('alert-list');
const invoiceForm = document.getElementById('invoice-form');
const invoiceList = document.getElementById('invoice-list');
const generateAlertsButton = document.getElementById('generate-alerts');
const messageForm = document.getElementById('message-form');
const messageLog = document.getElementById('message-log');

function removeById(key, id) {
  const next = getData(key).filter(item => item.id !== id);
  setData(key, next);
}

function refreshCustomerState() {
  if (!customerEmpty || !customerForm || !toggleCustomerFormButton) {
    return;
  }
  const customers = getData(storageKeys.customers);
  const hasCustomers = customers.length > 0;
  customerEmpty.classList.toggle('hidden', hasCustomers);
  if (!hasCustomers) {
    customerForm.classList.remove('hidden');
    toggleCustomerFormButton.textContent = 'Hide Form';
  }
}

if (toggleCustomerFormButton && customerForm) {
  toggleCustomerFormButton.addEventListener('click', () => {
    customerForm.classList.toggle('hidden');
    toggleCustomerFormButton.textContent = customerForm.classList.contains('hidden') ? 'Create Customer' : 'Hide Form';
  });
}

function renderSelectOptions() {
  const customers = getData(storageKeys.customers);
  [jobForm?.customerId, invoiceForm?.customerId].forEach(select => {
    if (!select) return;
    select.innerHTML = '<option value="">Select customer</option>';
    customers.forEach(customer => {
      const option = document.createElement('option');
      option.value = customer.id;
      option.textContent = `${customer.name} (${customer.address})`;
      select.append(option);
    });
  });

  if (reportForm?.jobId) {
    const jobs = getData(storageKeys.jobs);
    reportForm.jobId.innerHTML = '<option value="">Select job</option>';
    jobs.forEach(job => {
      const option = document.createElement('option');
      option.value = job.id;
      option.textContent = `${job.description.slice(0, 40)} - ${job.address}`;
      reportForm.jobId.append(option);
    });
  }
}

function renderCustomers() {
  if (!customerList) return;
  const customers = getData(storageKeys.customers);
  customerList.innerHTML = customers
    .map(
      customer => `<div class="item"><strong>${customer.name}</strong><br>${customer.phone} · ${customer.email}<br>${customer.address}<br>${
        customer.isBusiness
          ? `Business | ABN: ${customer.abn || 'N/A'} | ${customer.businessInfo || 'No extra info'}`
          : 'Residential customer'
      }<div class="item-actions"><button class="danger" data-delete-customer="${customer.id}" type="button">Delete</button></div></div>`
    )
    .join('');
  refreshCustomerState();
}

function renderJobs() {
  if (!jobList) return;
  const customers = getData(storageKeys.customers);
  const customerById = Object.fromEntries(customers.map(c => [c.id, c]));
  const jobs = getData(storageKeys.jobs);
  jobList.innerHTML = jobs
    .map(job => {
      const customer = customerById[job.customerId];
      return `<div class="item"><strong>${job.description}</strong><br>Customer: ${customer?.name || 'Unknown'}<br>Address: ${job.address}<br>Scheduled: ${new Date(
        job.scheduledAt
      ).toLocaleString()}<div class="item-actions"><button class="danger" data-delete-job="${job.id}" type="button">Delete</button></div></div>`;
    })
    .join('');
}

function renderInvoices() {
  if (!invoiceList) return;
  const customers = getData(storageKeys.customers);
  const customerById = Object.fromEntries(customers.map(c => [c.id, c]));
  const invoices = getData(storageKeys.invoices);
  invoiceList.innerHTML = invoices
    .map(invoice => {
      const customer = customerById[invoice.customerId];
      return `<div class="item"><strong>Invoice #${invoice.number}</strong><br>To: ${customer?.name || 'Unknown'}<br>Service: ${
        invoice.service
      }<br>Amount: $${invoice.amount.toFixed(2)}<br>Payment Info: ${invoice.paymentInfo}<div class="item-actions"><button class="danger" data-delete-invoice="${
        invoice.id
      }" type="button">Delete</button></div></div>`;
    })
    .join('');
}

function renderReports() {
  if (!reportList) return;
  const reports = getData(storageKeys.reports);
  reportList.innerHTML = reports
    .map(
      report => `<div class="item"><strong>${report.customerName}</strong><br>${report.jobDescription}<br>${report.address}<br>Completed: ${new Date(
        report.completedAt
      ).toLocaleString()}<div class="item-actions"><button type="button" data-preview-report="${report.id}">View</button><button class="danger" type="button" data-delete-report="${
        report.id
      }">Delete</button></div></div>`
    )
    .join('');
}

function printOnlyReport(reportHtml) {
  const printWindow = window.open('', '_blank', 'width=900,height=1200');
  if (!printWindow) return;
  printWindow.document.write(`
    <html>
      <head>
        <title>Service Report - ToxinResin</title>
        <style>
          body { font-family: Inter, Arial, sans-serif; margin: 20px; color: #111827; }
          .pdf-report { border: 2px solid #334155; border-radius: 8px; padding: 16px; }
          img { width: 100%; max-height: 320px; object-fit: cover; border-radius: 8px; }
        </style>
      </head>
      <body>${reportHtml}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function buildReportPreview(report) {
  if (!reportPreview) return;
  const template = document.getElementById('report-template');
  if (!template) return;

  const fragment = template.content.cloneNode(true);
  const setField = (field, value) => {
    const node = fragment.querySelector(`[data-field="${field}"]`);
    if (!node) return;
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
  exportBtn.textContent = 'Export Service Report PDF';
  exportBtn.addEventListener('click', () => {
    const reportElement = reportPreview.querySelector('.pdf-report');
    if (!reportElement) return;
    printOnlyReport(reportElement.outerHTML);
  });
  reportPreview.append(exportBtn);
}

function renderMessageLog() {
  if (!messageLog) return;
  const messages = getData(storageKeys.messages);
  messageLog.innerHTML = messages
    .map(
      msg => `<div class="item"><strong>${msg.channel}</strong> to ${msg.recipient}<br>${msg.message}<br><small>${new Date(
        msg.createdAt
      ).toLocaleString()}</small><div class="item-actions"><button class="danger" type="button" data-delete-message="${msg.id}">Delete</button></div></div>`
    )
    .join('');
}

if (customerForm) {
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
    if (toggleCustomerFormButton) toggleCustomerFormButton.textContent = 'Create Customer';
    renderCustomers();
    renderSelectOptions();
  });
}

if (customerList) {
  customerList.addEventListener('click', event => {
    const button = event.target.closest('[data-delete-customer]');
    if (!button) return;
    removeById(storageKeys.customers, button.dataset.deleteCustomer);
    renderCustomers();
    renderSelectOptions();
  });
}

if (jobForm) {
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
}

if (jobList) {
  jobList.addEventListener('click', event => {
    const button = event.target.closest('[data-delete-job]');
    if (!button) return;
    const jobId = button.dataset.deleteJob;
    removeById(storageKeys.jobs, jobId);
    setData(
      storageKeys.reports,
      getData(storageKeys.reports).filter(report => report.jobId !== jobId)
    );
    renderJobs();
    renderReports();
    renderSelectOptions();
  });
}

if (reportForm) {
  reportForm.addEventListener('submit', async event => {
    event.preventDefault();
    const form = new FormData(reportForm);
    const file = form.get('propertyPhoto');
    const jobId = String(form.get('jobId'));

    const jobs = getData(storageKeys.jobs);
    const customers = getData(storageKeys.customers);
    const job = jobs.find(j => j.id === jobId);
    const customer = customers.find(c => c.id === job?.customerId);

    if (!job || !file || !(file instanceof File)) return;

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
    renderReports();
    reportForm.reset();
  });
}

if (reportList) {
  reportList.addEventListener('click', event => {
    const previewButton = event.target.closest('[data-preview-report]');
    if (previewButton) {
      const report = getData(storageKeys.reports).find(item => item.id === previewButton.dataset.previewReport);
      if (report) buildReportPreview(report);
      return;
    }
    const deleteButton = event.target.closest('[data-delete-report]');
    if (!deleteButton) return;
    removeById(storageKeys.reports, deleteButton.dataset.deleteReport);
    renderReports();
    if (reportPreview) reportPreview.innerHTML = '';
  });
}

if (generateAlertsButton && alertList) {
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
}

if (invoiceForm) {
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
}

if (invoiceList) {
  invoiceList.addEventListener('click', event => {
    const button = event.target.closest('[data-delete-invoice]');
    if (!button) return;
    removeById(storageKeys.invoices, button.dataset.deleteInvoice);
    renderInvoices();
  });
}

if (messageForm) {
  messageForm.addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(messageForm);
    const channel = String(form.get('channel'));
    const recipient = String(form.get('recipient'));
    const subject = String(form.get('subject') || '');
    const message = String(form.get('message'));

    const messages = getData(storageKeys.messages);
    messages.unshift({
      id: uid(),
      channel,
      recipient,
      subject,
      message,
      createdAt: new Date().toISOString()
    });
    setData(storageKeys.messages, messages);
    renderMessageLog();

    if (channel === 'Email') {
      const mailto = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      window.open(mailto, '_blank');
    } else {
      const sms = `sms:${encodeURIComponent(recipient)}?body=${encodeURIComponent(message)}`;
      window.open(sms, '_blank');
    }

    messageForm.reset();
  });
}

if (messageLog) {
  messageLog.addEventListener('click', event => {
    const button = event.target.closest('[data-delete-message]');
    if (!button) return;
    removeById(storageKeys.messages, button.dataset.deleteMessage);
    renderMessageLog();
  });
}

renderCustomers();
renderJobs();
renderReports();
renderInvoices();
renderSelectOptions();
renderMessageLog();
