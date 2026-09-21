import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import es from '../src/renderer/locales/es.json';
import zhCN from '../src/renderer/locales/zh-CN.json';
import zhTW from '../src/renderer/locales/zh-TW.json';
import ja from '../src/renderer/locales/ja.json';
import tr from '../src/renderer/locales/tr.json';

let dom: JSDOM;
beforeEach(() => {
  vi.resetModules();
  dom = new JSDOM(readFileSync('src/renderer/index.html', 'utf8'), { url: 'https://local.test/' });
  Object.assign(globalThis, { window: dom.window, document: dom.window.document,
    Node: dom.window.Node, Element: dom.window.Element, HTMLElement: dom.window.HTMLElement });
});
afterEach(() => { vi.restoreAllMocks(); dom.window.close(); });

describe('Turkish app interface', () => {
  it('covers every existing source and preserves all numbered arguments', () => {
    const sources = [...new Set([es, zhCN, zhTW, ja].flatMap(catalog => Object.keys(catalog)))].sort();
    expect(Object.keys(tr).sort()).toEqual(sources);
    for (const [source, translation] of Object.entries(tr)) {
      expect(translation.trim(), source).not.toBe('');
      const args = (text: string) => (text.match(/\{\d+\}/g) ?? []).sort();
      expect(args(translation), source).toEqual(args(source));
    }
  });

  it('restores Turkish and synchronizes setup, appearance and the saved choice', async () => {
    window.localStorage.setItem('cos.ui.language', 'tr');
    const { initLanguage, currentLanguage } = await import('../src/renderer/i18n.js');
    initLanguage();
    const select = document.getElementById('uiLanguage') as HTMLSelectElement;
    const button = document.querySelector<HTMLButtonElement>('[data-language="tr"]')!;
    expect(button.closest('[data-panel="setup"]')).not.toBeNull();
    expect(button.querySelector('svg.language-flag[aria-hidden="true"]')).not.toBeNull();
    expect([button.lang, button.title, button.getAttribute('aria-label')]).toEqual(['tr', 'Türkçe', 'Türkçe']);
    expect(button.textContent).toBe('');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(currentLanguage()).toBe('tr');
    expect(document.documentElement.lang).toBe('tr');
    expect(document.querySelector('.setup-heading h1')!.textContent).toBe('Kurulum');
    expect(select.value).toBe('tr');
    expect(select.selectedOptions[0]!.textContent).toBe('Türkçe');
    select.value = 'en';
    select.dispatchEvent(new dom.window.Event('change'));
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(document.querySelector('.setup-heading h1')!.textContent).toBe('Setup');
    button.click();
    expect(select.value).toBe('tr');
    expect(window.localStorage.getItem('cos.ui.language')).toBe('tr');
    vi.resetModules();
    const reloaded = await import('../src/renderer/i18n.js');
    expect(reloaded.currentLanguage()).toBe('tr');
    expect(reloaded.t('Settings')).toBe('Ayarlar');
  });

  it('preserves Turkish drafts, focus, authored content and literal arguments across languages', async () => {
    const { initLanguage, setLanguage, t, ui, uiText } = await import('../src/renderer/i18n.js');
    initLanguage();
    const input = document.getElementById('chatInput') as HTMLTextAreaElement;
    const draft = '/review\nİı Şş Ğğ Üü Öö Çç 🙂 <script>taslak</script>';
    input.value = draft; input.focus(); input.setSelectionRange(2, 12);
    const authored = document.createElement('p'); authored.textContent = 'Settings';
    const hidden = document.createElement('div'); hidden.hidden = true;
    const label = uiText(() => t('Settings')); hidden.append(label);
    const argument = '$& /çalışma/Save <img src=x>';
    const action = ui(document.createElement('button'), 'textContent', () => t('Remove {0}', [argument]));
    const renamed = ui(document.createElement('span'), 'textContent', () => t('New chat'));
    renamed.textContent = 'Kullanıcının sohbet başlığı';
    document.body.append(authored, hidden, action, renamed);
    const icons = [...document.querySelectorAll('svg')];
    for (const locale of ['tr', 'es', 'zh-CN', 'zh-TW', 'ja', 'en', 'tr'] as const) {
      setLanguage(locale);
      expect(document.getElementById('chatInput')).toBe(input);
      expect(input.value).toBe(draft);
      expect([input.selectionStart, input.selectionEnd]).toEqual([2, 12]);
      expect(document.activeElement).toBe(input);
      expect([...document.querySelectorAll('svg')]).toEqual(icons);
      expect(authored.textContent).toBe('Settings');
      expect(renamed.textContent).toBe('Kullanıcının sohbet başlığı');
      expect(document.querySelector<HTMLButtonElement>('[data-language="tr"]')!.title).toBe('Türkçe');
      expect(action.textContent).toContain(argument);
      expect(action.querySelector('img')).toBeNull();
    }
    expect(label.textContent).toBe('Ayarlar');
    expect(action.textContent).toBe(t('Remove {0}', [argument]));
    expect(t('  Settings\n')).toBe('Ayarlar');
    expect(t('unknown source {0}', [argument])).toBe(`unknown source ${argument}`);
    for (const source of ['__proto__', 'toString', 'exec_command', 'gpt-6-astra']) expect(t(source)).toBe(source);
  });

  it('matches dotted and dotless Turkish I in settings search without changing section text', async () => {
    const { setLanguage } = await import('../src/renderer/i18n.js');
    const { el, filterSettingsSections } = await import('../src/renderer/dom.js');
    const view = el('div', '');
    const permissions = el('h2', 'settings-section-title', 'İzinler');
    const permissionsPane = el('div', 'pane', 'Bildirimler');
    const appearance = el('h2', 'settings-section-title', 'Görünüm');
    const appearancePane = el('div', 'pane', 'Işık');
    view.append(permissions, permissionsPane, appearance, appearancePane);
    document.body.append(view);
    setLanguage('tr');
    for (const query of ['izinler', 'İZİNLER', '  BİLDİRİMLER  ']) {
      filterSettingsSections(view, query);
      expect(permissions.hidden).toBe(false);
      expect(permissionsPane.hidden).toBe(false);
      expect(appearance.hidden).toBe(true);
    }
    for (const query of ['ışık', 'IŞIK']) {
      filterSettingsSections(view, query);
      expect(appearance.hidden).toBe(false);
      expect(appearancePane.hidden).toBe(false);
      expect(permissions.hidden).toBe(true);
    }
    expect(permissions.textContent).toBe('İzinler');
    expect(appearancePane.textContent).toBe('Işık');
    filterSettingsSections(view, '');
    expect([...view.children].every(node => !(node as HTMLElement).hidden)).toBe(true);
  });

  it('translates catalogued errors but leaves external errors and successful data untouched', async () => {
    window.localStorage.setItem('cos.ui.language', 'tr');
    const { run } = await import('../src/renderer/dom.js');
    expect(await run(Promise.resolve({ ok: false, error: 'Secure credential storage is unavailable.' }))).toBeNull();
    expect(document.querySelector('.toast')?.textContent).toBe(tr['Secure credential storage is unavailable.']);
    const nativeError = 'NATIVE_ERROR: /İşler/<img src=x> {0}\n  details';
    expect(await run(Promise.resolve({ ok: false, error: nativeError }))).toBeNull();
    expect(document.querySelector('.toast')?.textContent).toBe(nativeError);
    expect(document.querySelector('.toast img')).toBeNull();
    expect(await run(Promise.resolve({ ok: true, data: 'Settings' }))).toBe('Settings');
  });

  it('defaults to English and allows Turkish even if preference storage is unavailable', async () => {
    expect((await import('../src/renderer/i18n.js')).currentLanguage()).toBe('en');
    expect(window.localStorage.getItem('cos.ui.language')).toBeNull();
    vi.resetModules();
    window.localStorage.setItem('cos.ui.language', 'invalid');
    expect((await import('../src/renderer/i18n.js')).currentLanguage()).toBe('en');
    vi.resetModules();
    vi.spyOn(dom.window.Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('unavailable'); });
    vi.spyOn(dom.window.Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('unavailable'); });
    const { initLanguage, currentLanguage, t } = await import('../src/renderer/i18n.js');
    initLanguage();
    document.querySelector<HTMLButtonElement>('[data-language="tr"]')!.click();
    expect(currentLanguage()).toBe('tr');
    expect(document.documentElement.lang).toBe('tr');
    expect((document.getElementById('uiLanguage') as HTMLSelectElement).value).toBe('tr');
    expect(t('Settings')).toBe('Ayarlar');
  });
});
