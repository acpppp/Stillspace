(() => {
  const colors = {
    fur: [
      {id: 'ember', name: 'Ember', color: '#d17a43', highlight: '#ef9a55', outline: '#623a2d'},
      {id: 'ash', name: 'Ash', color: '#666878', highlight: '#8c90a4', outline: '#3e4050'},
      {id: 'cream', name: 'Cream', color: '#d7b687', highlight: '#f5d4a2', outline: '#785740'},
      {id: 'rose', name: 'Rose', color: '#bc7385', highlight: '#dd9bac', outline: '#734554'}
    ],
    eyes: [
      {id: 'brown', name: 'Brown', color: '#52362d'},
      {id: 'amber', name: 'Amber', color: '#da913c'},
      {id: 'moss', name: 'Moss', color: '#698a50'},
      {id: 'blue', name: 'Blue', color: '#6289a6'}
    ],
    background: [
      {id: 'oat', name: 'Oat', color: '#f6efe1'},
      {id: 'mist', name: 'Lilac mist', color: '#eee8f1'},
      {id: 'fern', name: 'Fern', color: '#e6eee0'},
      {id: 'petal', name: 'Rose petal', color: '#f5e7e4'}
    ]
  };
  const labels = {fur: 'Rue’s fur', eyes: 'Rue’s eyes', background: 'Page background'};
  const buttons = {
    start: {label: 'Start & pause button', color: '#a54c2c'},
    reset: {label: 'Reset button', color: '#fff8ec'},
    mode: {label: 'Selected timer mode', color: '#536148'}
  };
  const fields = {
    ...labels,
    background: 'Gradient start',
    backgroundEnd: 'Gradient end',
    timerText: 'Countdown text',
    ...Object.fromEntries(Object.entries(buttons).map(([id, button]) => [id, button.label]))
  };
  function normalizeHex(value) {
    if (typeof value !== 'string') return null;
    const hex = value.trim().replace(/^#/, '');
    return /^[\da-f]{6}$/i.test(hex) ? '#' + hex.toLowerCase() : null;
  }
  const rgb = hex => [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16));
  function mix(hex, target, proportion) {
    return '#' + rgb(hex).map(channel => Math.round(channel + (target - channel) * proportion).toString(16).padStart(2, '0')).join('');
  }
  function luminance(hex) {
    const [r, g, b] = rgb(hex).map(channel => {
      const unit = channel / 255;
      return unit <= .04045 ? unit / 12.92 : ((unit + .055) / 1.055) ** 2.4;
    });
    return .2126 * r + .7152 * g + .0722 * b;
  }
  function buttonText(hex) {
    return luminance(hex) > .179 ? '#000000' : '#ffffff';
  }

  window.setupAppearance = (saved, persist) => {
    const container = document.querySelector('#appearance-colors');
    const cabin = document.querySelector('#cabin-view');
    const swatches = [];
    const themeInputs = [];
    const theme = document.querySelector('#custom-theme-colors');
    const cardColor = normalizeHex(getComputedStyle(document.body).getPropertyValue('--card')) || '#fff9ed';
    const cardLightness = luminance(cardColor);
    theme.closest('details').open = matchMedia('(min-width: 650px)').matches;
    const resetTheme = document.querySelector('#reset-theme');
    let selections;

    function colorError(field, color) {
      if (!color) return 'Enter a six-digit hex color, like #f6efe1.';
      if (field === 'timerText') {
        const textLightness = luminance(color);
        const contrast = (Math.max(cardLightness, textLightness) + .05) /
          (Math.min(cardLightness, textLightness) + .05);
        if (contrast < 3) return 'Choose a color with more contrast against the timer card.';
      }
      return '';
    }

    function restore(value) {
      selections = {cabin: value?.cabin === true, custom: {}};
      for (const [group, choices] of Object.entries(colors)) {
        selections[group] = choices.find(choice => choice.id === value?.[group])?.id || choices[0].id;
      }
      for (const field of Object.keys(fields)) {
        const color = normalizeHex(value?.custom?.[field]);
        if (!colorError(field, color)) selections.custom[field] = color;
      }
      render();
    }

    function render(activeInput) {
      const {custom} = selections;
      const presets = Object.fromEntries(Object.entries(colors).map(([group, choices]) =>
        [group, choices.find(choice => choice.id === selections[group])]));
      const fur = custom.fur
        ? {color: custom.fur, highlight: mix(custom.fur, 255, .25), outline: mix(custom.fur, 0, .52)}
        : presets.fur;
      const eyes = custom.eyes ? {color: custom.eyes} : presets.eyes;
      const background = custom.background || presets.background.color;
      window.stillspacePalette = {fur, eyes};
      const style = document.body.style;
      style.setProperty('--paper', background);
      style.setProperty('--paper-end', custom.backgroundEnd || background);
      style.setProperty('--countdown-color', custom.timerText || '#513729');
      document.querySelector('meta[name="theme-color"]').content = background;
      document.body.dataset.view = selections.cabin ? 'cabin' : 'simple';
      document.body.dataset.palette = [fur.color, eyes.color, background].join(' ');
      for (const field of Object.keys(buttons)) {
        const color = custom[field];
        if (color) {
          style.setProperty('--timer-' + field, color);
          style.setProperty('--timer-' + field + '-text', buttonText(color));
          style.setProperty('--timer-' + field + '-edge', mix(color, 0, .3));
        } else {
          for (const suffix of ['', '-text', '-edge']) style.removeProperty('--timer-' + field + suffix);
        }
      }
      cabin.setAttribute('aria-pressed', String(selections.cabin));
      cabin.textContent = selections.cabin ? 'Rue only' : 'Cabin';
      for (const {input, group, choice} of swatches) input.checked = !custom[group] && selections[group] === choice.id;
      const defaults = {backgroundEnd: background, timerText: '#513729'};
      for (const {field, picker, hex} of themeInputs) {
        const color = custom[field] || presets[field]?.color || defaults[field] || buttons[field].color;
        picker.value = color;
        if (hex !== activeInput && !hex.hasAttribute('aria-invalid')) hex.value = color;
      }
      resetTheme.disabled = Object.keys(custom).length === 0 &&
        !themeInputs.some(({hex}) => hex.hasAttribute('aria-invalid'));
    }

    for (const [group, choices] of Object.entries(colors)) {
      const fieldset = document.createElement('fieldset');
      fieldset.className = 'color-group';
      const legend = document.createElement('legend');
      legend.textContent = labels[group];
      fieldset.append(legend);
      for (const choice of choices) {
        const label = document.createElement('label');
        label.className = 'color-choice';
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'appearance-' + group;
        input.setAttribute('aria-label', choice.name);
        const sample = document.createElement('span');
        sample.style.setProperty('--swatch', choice.color);
        label.title = choice.name;
        label.append(input, sample);
        fieldset.append(label);
        swatches.push({input, group, choice});
        input.addEventListener('change', () => {
          selections[group] = choice.id;
          delete selections.custom[group];
          if (group === 'background') delete selections.custom.backgroundEnd;
          for (const {field, showError} of themeInputs) {
            if (field === group || (group === 'background' && field === 'backgroundEnd')) showError('');
          }
          render();
          persist();
        });
      }
      container.append(fieldset);
    }

    for (const [field, label] of Object.entries(fields)) {
      const row = document.createElement('div');
      row.className = 'theme-color';
      const caption = document.createElement('label');
      caption.textContent = label;
      caption.htmlFor = 'theme-' + field;
      const picker = document.createElement('input');
      picker.id = caption.htmlFor;
      picker.type = 'color';
      const hex = document.createElement('input');
      hex.type = 'text';
      hex.maxLength = 7;
      hex.autocomplete = 'off';
      hex.spellcheck = false;
      hex.setAttribute('aria-label', label + ' hex code');
      const error = document.createElement('p');
      error.className = 'theme-error';
      error.id = 'theme-error-' + field;
      error.setAttribute('aria-live', 'polite');
      hex.setAttribute('aria-describedby', error.id);
      picker.setAttribute('aria-describedby', error.id);
      function showError(message) {
        if (message) hex.setAttribute('aria-invalid', 'true');
        else hex.removeAttribute('aria-invalid');
        if (error.textContent !== message) error.textContent = message;
      }
      themeInputs.push({field, picker, hex, showError});
      function applyColor(color, activeInput) {
        const changed = selections.custom[field] !== color;
        if (changed) selections.custom[field] = color;
        showError('');
        render(activeInput);
        if (changed) persist();
      }
      function pickColor() {
        const color = normalizeHex(picker.value);
        const message = colorError(field, color);
        if (!message) {
          applyColor(color);
        } else {
          hex.value = picker.value;
          showError(message);
          render(hex);
        }
      }
      function checkHex(onBlur) {
        const color = normalizeHex(hex.value);
        const message = colorError(field, color);
        if (!message) {
          if (onBlur) render();
          else applyColor(color, hex);
        } else if (onBlur || color || hex.hasAttribute('aria-invalid')) {
          showError(message);
          render(hex);
        }
      }
      picker.addEventListener('change', pickColor);
      hex.addEventListener('input', () => checkHex(false));
      hex.addEventListener('blur', () => checkHex(true));
      row.append(caption, picker, hex, error);
      theme.append(row);
    }
    resetTheme.addEventListener('click', () => {
      selections.custom = {};
      for (const {showError} of themeInputs) showError('');
      render();
      persist();
    });
    cabin.addEventListener('click', () => {
      selections.cabin = !selections.cabin;
      render();
      persist();
    });
    restore(saved);
    return {restore, snapshot: () => selections};
  };
})();
