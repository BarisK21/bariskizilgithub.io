const $ = (selector) => document.querySelector(selector);

function escapeHtml(value) {
  const element = document.createElement('div');
  element.textContent = value;
  return element.innerHTML;
}

function formatDate(date) {
  return new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }).format(new Date(date));
}

function applyTheme() {
  const isLight = localStorage.getItem('theme') === 'light';
  document.body.classList.toggle('light', isLight);
  document.querySelectorAll('.theme-toggle').forEach((button) => {
    button.setAttribute('aria-label', isLight ? 'Dunkles Farbschema aktivieren' : 'Helles Farbschema aktivieren');
    button.firstElementChild.textContent = isLight ? '☾' : '☼';
  });
}

function actionLinks(project) {
  return [
    project.liveUrl && `<a class="button" href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">Projekt ansehen ↗</a>`,
    project.githubUrl && `<a class="button button-ghost" href="${project.githubUrl}" target="_blank" rel="noopener noreferrer">Quellcode ↗</a>`,
    project.downloadUrl && `<a class="button button-ghost" href="${project.downloadUrl}">Download ↓</a>`
  ].filter(Boolean).join('');
}

function renderProject(project) {
  document.title = `${project.name} · Baris Kizil`;
  document.querySelector('meta[name=description]').content = `${project.name}: ${project.shortDescription}`;
  $('#project-detail').innerHTML = `
    <a class="back-link" href="index.html#projects">← Zurück zu allen Projekten</a>
    <section class="detail-hero"><div>
      <p class="eyebrow">${escapeHtml(project.status)} · ${formatDate(project.date)}</p>
      <h1 class="detail-title">${escapeHtml(project.name)}<span class="accent">.</span></h1>
      <p class="detail-summary">${escapeHtml(project.description)}</p>
      <div class="tags">${project.technologies.map((technology) => `<span class="tag">${escapeHtml(technology)}</span>`).join('')}</div>
      <div class="detail-actions">${actionLinks(project)}</div>
    </div><img src="${project.image}" alt="Vorschau von ${escapeHtml(project.name)}"></section>
    <section class="detail-content"><div>
      <h2>Was das Projekt kann</h2><ul class="feature-list">${project.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join('')}</ul>
      <h2>Herausforderung</h2><p>${escapeHtml(project.challenges)}</p>
      <h2>Die Lösung</h2><p>${escapeHtml(project.solution)}</p>
    </div><aside class="facts" aria-label="Projektdaten"><dl>
      <div class="fact"><dt>Status</dt><dd>${escapeHtml(project.status)}</dd></div>
      <div class="fact"><dt>Entwicklungsdauer</dt><dd>${escapeHtml(project.duration)}</dd></div>
      <div class="fact"><dt>Erstellt</dt><dd>${formatDate(project.date)}</dd></div>
      <div class="fact"><dt>Technologien</dt><dd>${project.technologies.map(escapeHtml).join(', ')}</dd></div>
    </dl></aside></section>
    <section class="gallery"><p class="eyebrow">Einblicke</p><h2>Projektgalerie</h2><div class="gallery-grid">${project.gallery.map((image, index) => `<img src="${image}" alt="${escapeHtml(project.name)} – Ansicht ${index + 1}" loading="lazy">`).join('')}</div></section>`;
}

async function init() {
  applyTheme();
  $('#year').textContent = new Date().getFullYear();
  $('.theme-toggle').onclick = () => {
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'dark' : 'light');
    applyTheme();
  };
  try {
    const projects = await fetch('data/projects.json').then((response) => response.json());
    const project = projects.find((item) => item.id === new URLSearchParams(location.search).get('id'));
    if (!project) throw new Error('Projekt nicht gefunden');
    renderProject(project);
  } catch {
    $('#project-detail').innerHTML = '<p class="empty">Dieses Projekt wurde nicht gefunden. <a class="text-link" href="index.html#projects">Zur Projektübersicht</a></p>';
  }
}

init();
