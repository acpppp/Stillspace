(() => {
  const items = [
    {
      id: 'sunset', kind: 'background', name: 'Sunset', free: true, description: 'Warm light through the trees.',
      icon: '<path fill="#ab613d" d="M3 13h14v2H3zm-2 4h18v2H1z"/><path fill="#dda450" d="M8 3h4v2h2v2h2v4H4V7h2V5h2z"/>'
    },
    {
      id: 'night', kind: 'background', name: 'Moonlight', free: true, description: 'A clear sky with twinkling stars.',
      icon: '<path fill="#716484" d="M6 2h5v2H8v2H6v6h2v2h6v-2h2v5h-2v2H6v-2H3v-3H1V7h2V4h3z"/><path fill="#b69766" d="M16 3h1v2h2v1h-2v2h-1V6h-2V5h2z"/>'
    },
    {
      id: 'biscuit', name: 'Berry biscuit', cost: 1, description: 'A crunchy snack for Rue.',
      icon: '<path fill="#a46343" d="M5 2h10v2h3v3h2v8h-2v3h-3v2H5v-2H2v-3H0V7h2V4h3z"/><path fill="#e8ae6c" d="M5 4h10v2h3v9h-3v3H5v-3H2V7h3z"/><path fill="#ac534e" d="M6 7h3v3H6zm6 4h3v3h-3zM6 14h2v2H6z"/>'
    },
    {
      id: 'flowers', name: 'Flower box', cost: 2, description: 'Wildflowers under the cabin window.',
      icon: '<path fill="#6b7549" d="M4 6h2v8H4zm5 0h2v8H9zm5 1h2v7h-2z"/><path fill="#d97662" d="M2 4h6v5H2zm10 1h6v5h-6z"/><path fill="#ffd38a" d="M7 2h6v5H7zM4 5h2v2H4zm10 1h2v2h-2z"/><path fill="#86523d" d="M1 12h18v3h-2v4H3v-4H1z"/><path fill="#be8256" d="M3 13h14v2H3zm2 3h10v2H5z"/>'
    },
    {
      id: 'hat', kind: 'outfit', name: 'Mushroom hat', cost: 2, description: 'A very serious hat for a very silly fox.',
      icon: '<path fill="#813f38" d="M6 2h8v2h3v3h2v5h-2v2h-4v5H7v-5H3v-2H1V7h2V4h3z"/><path fill="#c46a54" d="M6 4h8v2h3v5H3V7h3z"/><path fill="#ffddad" d="M6 6h3v3H6zm6-1h2v2h-2zm2 4h2v2h-2zM7 12h6v5H7z"/>'
    },
    {
      id: 'bunting', name: 'Patchwork bunting', cost: 3, description: 'Little flags along the cabin eaves.',
      icon: '<path fill="#846448" d="M0 3h4v2h5v1h4V5h4V3h3v2h-3v2h-4v1H9V7H4V5H0z"/><path fill="#c87058" d="M1 5h5v4H5v2H4v2H3v-2H2V9H1z"/><path fill="#d7a45c" d="M8 8h5v4h-1v2h-1v2h-1v-2H9v-2H8z"/><path fill="#75845b" d="M15 6h5v4h-1v2h-1v2h-1v-2h-1v-2h-1z"/>'
    },
    {
      id: 'lanterns', name: 'Path lanterns', cost: 4, description: 'Amber lights beside the front steps.',
      icon: '<path fill="#754d39" d="M8 0h4v2h2v3h2v2h2v9h-2v2h-3v2H7v-2H4v-2H2V7h2V5h2V2h2z"/><path fill="#f4bd59" d="M5 7h10v9H5z"/><path fill="#ffdf8b" d="M6 8h3v7H6zm5 0h3v7h-3z"/><path fill="#ac733e" d="M9 7h2v9H9z"/>'
    },
    {
      id: 'rain', kind: 'background', name: 'Rainy forest', cost: 3, description: 'A soft drizzle and puddles along the path.',
      icon: '<path fill="#6d8790" d="M5 2h9v2h3v3h3v4H0V7h2V4h3z"/><path fill="#94b9bd" d="M2 13h2v4H2zm6 2h2v5H8zm6-2h2v4h-2zm4 3h2v3h-2z"/>'
    },
    {
      id: 'snow', kind: 'background', name: 'Snowy cabin', cost: 4, description: 'Falling snow and a frosted cabin roof.',
      icon: '<path fill="#718b9f" d="M9 0h2v20H9zM0 9h20v2H0zM3 3h2v2H3zm2 2h2v2H5zm8 8h2v2h-2zm2 2h2v2h-2zm0-12h2v2h-2zm-2 2h2v2h-2zm-8 8h2v2H5zm-2 2h2v2H3z"/><path fill="#c2dce4" d="M7 7h6v6H7z"/>'
    },
    {
      id: 'duck', kind: 'outfit', name: 'Duck raincoat', cost: 2, description: 'A yellow hood with a tiny duck bill.',
      icon: '<path fill="#876039" d="M4 1h10v2h3v4h3v6h-4v6H3V9H1V5h3z"/><path fill="#edbc54" d="M5 3h8v2h3v8h-2v4H5V7H3V5h2z"/><path fill="#e68e4b" d="M14 9h5v3h-5z"/><path fill="#63462f" d="M12 6h2v2h-2z"/>'
    },
    {
      id: 'wizard', kind: 'outfit', name: 'Tiny wizard', cost: 3, description: 'A crooked hat for casting focus spells.',
      icon: '<path fill="#554563" d="M10 0h6v3h-3v4h2v6h3v2h2v4H0v-4h3v-2h2V8h2V4h3z"/><path fill="#8c73ac" d="M11 2h3v1h-3v5h2v6H7V9h2V5h2zM2 16h16v2H2z"/><path fill="#f1c878" d="M8 11h4v3H8z"/>'
    }
  ];
  const unlockables = items.filter(item => item.id !== 'biscuit' && !item.free);
  const outfits = items.filter(item => item.kind === 'outfit').map(item => item.id);
  const skies = [
    {id: 'sunset', name: 'Sunset', description: 'at sunset'},
    {id: 'night', name: 'Moonlight', description: 'under a starry sky'},
    {id: 'rain', name: 'Rainy forest', description: 'in the rain'},
    {id: 'snow', name: 'Snowy cabin', description: 'in falling snow'}
  ];
  const star = '<svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M8 1h4v5h6v4h-3v3h2v5h-5v-3H8v3H3v-5h2v-3H2V6h6z"/></svg>';
  function readProgress(saved, fallback = 0) {
    const balance = Number.isSafeInteger(saved?.balance) && saved.balance >= 0 ? saved.balance : fallback;
    const owned = unlockables.filter(item => Array.isArray(saved?.owned) && saved.owned.includes(item.id)).map(item => item.id);
    const placed = unlockables.filter(item => item.kind !== 'background' && owned.includes(item.id) &&
      Array.isArray(saved?.placed) && saved.placed.includes(item.id)).map(item => item.id);
    const available = skies.filter((sky, i) => i < 2 || owned.includes(sky.id));
    return {balance, owned, placed, sky: available.some(sky => sky.id === saved?.sky) ? saved.sky : 'sunset'};
  }

  window.setupCabinShop = (saved, previousStars, persist) => {
    const dialog = document.querySelector('#cabin-shop');
    const open = document.querySelector('#open-shop');
    const wallet = document.querySelector('#wallet');
    const balanceLabel = document.querySelector('#shop-balance');
    const list = document.querySelector('#shop-items');
    const filters = [...document.querySelectorAll('[data-shop-filter]')];
    const feedback = document.querySelector('#shop-feedback');
    const announcement = document.querySelector('#play-note');
    const skySwitch = document.querySelector('#sky-switch');
    const skyLabel = skySwitch.querySelector('span');
    const skyIcon = skySwitch.querySelector('path');
    const scene = document.querySelector('#woodland');
    let progress = readProgress(saved, previousStars);
    let filter = 'cabin';

    const entries = items.map(item => {
      const row = document.createElement('li');
      row.className = 'shop-item';
      row.innerHTML = `<div class="item-preview"><svg viewBox="0 0 20 20" aria-hidden="true" shape-rendering="crispEdges">${item.icon}</svg></div>
        <div class="item-info"><strong>${item.name}</strong><small>${item.description}</small></div>
        <button class="item-action" type="button"></button>`;
      const button = row.querySelector('button');
      button.addEventListener('click', () => choose(item));
      list.append(row);
      return {item, row, button};
    });

    function render() {
      const {balance, owned, placed, sky} = progress;
      const plural = balance === 1 ? 'star' : 'stars';
      wallet.innerHTML = star + balance;
      open.setAttribute('aria-label', `Cabin shop, ${balance} ${plural} to spend`);
      balanceLabel.innerHTML = star + `${balance} ${plural} to spend`;
      document.body.dataset.decor = placed.join(' ');
      document.body.dataset.sky = sky;
      const next = nextSky();
      const skyIcons = {
        sunset: 'M7 0h2v3H7zm0 13h2v3H7zM0 7h3v2H0zm13 0h3v2h-3zM5 4h6v1h1v6h-1v1H5v-1H4V5h1z',
        night: 'M7 1h3v2H8v6h2v2h5v2h-2v2H6v-2H3v-3H1V6h2V3h4z',
        rain: 'M4 2h8v2h2v2h2v3H0V6h2V4h2zm-1 9h2v4H3zm5 1h2v4H8zm5-1h2v4h-2z',
        snow: 'M7 0h2v16H7zM0 7h16v2H0zM2 2h2v2H2zm3 3h6v6H5zm7-3h2v2h-2zM2 12h2v2H2zm10 0h2v2h-2z'
      };
      skyLabel.textContent = next.id === 'rain' ? 'Rain' : next.id === 'snow' ? 'Snow' : next.name;
      skySwitch.setAttribute('aria-label', 'Switch to ' + next.name.toLowerCase());
      skyIcon.setAttribute('d', skyIcons[next.id]);
      scene.setAttribute('aria-label', `Animated pixel art of Rue outside a forest cabin ${skies.find(entry => entry.id === sky).description}.`);
      filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.shopFilter === filter)));
      for (const {item, row, button} of entries) {
        row.hidden = (item.kind || 'cabin') !== filter;
        const isOwned = item.free || owned.includes(item.id);
        const isPlaced = item.kind === 'background' ? sky === item.id : placed.includes(item.id);
        const available = !(item.kind === 'background' && isPlaced) && (isOwned || balance >= item.cost);
        if (isOwned) {
          button.textContent = item.kind === 'background' ? (isPlaced ? 'In use' : 'Use')
            : item.kind === 'outfit' ? (isPlaced ? 'Take off' : 'Put on') : (isPlaced ? 'Put away' : 'Place');
          button.setAttribute('aria-label', isPlaced && item.kind === 'background'
            ? `${item.name} is in use` : `${button.textContent} ${item.name}`);
        } else {
          const verb = item.id === 'biscuit' ? 'Give' : 'Unlock';
          button.innerHTML = `<span>${verb}</span><span class="price">${star}${item.cost}</span>`;
          button.setAttribute('aria-label', `${verb} ${item.name} for ${item.cost} ${item.cost === 1 ? 'star' : 'stars'}`);
        }
        // Keep unavailable items focusable so their price and reason are discoverable.
        button.setAttribute('aria-disabled', String(!available));
        row.classList.toggle('is-placed', isPlaced);
      }
    }

    function nextSky() {
      const available = skies.filter((sky, index) => index < 2 || progress.owned.includes(sky.id));
      return available[(available.findIndex(sky => sky.id === progress.sky) + 1) % available.length];
    }

    function useItem(item) {
      if (item.kind === 'background') {
        progress.sky = item.id;
        return `${item.name} is now showing at Fox Hollow.`;
      }
      if (progress.placed.includes(item.id)) {
        progress.placed = progress.placed.filter(id => id !== item.id);
        return item.kind === 'outfit' ? `Rue took off ${item.name.toLowerCase()}.` : `${item.name} put away.`;
      }
      if (item.kind === 'outfit') {
        progress.placed = progress.placed.filter(id => !outfits.includes(id));
        progress.placed.push(item.id);
        return `Rue is wearing ${item.name.toLowerCase()}!`;
      }
      progress.placed.push(item.id);
      return `${item.name} placed at the cabin.`;
    }

    function choose(item) {
      if (item.free || progress.owned.includes(item.id)) {
        if (item.kind === 'background' && progress.sky === item.id) return;
        feedback.textContent = useItem(item);
      } else {
        if (progress.balance < item.cost) {
          const needed = item.cost - progress.balance;
          feedback.textContent = `Earn ${needed} more ${needed === 1 ? 'star' : 'stars'} to get ${item.name.toLowerCase()}.`;
          return;
        }
        progress.balance -= item.cost;
        if (item.id === 'biscuit') {
          dialog.close();
          document.dispatchEvent(new Event('rue-treat'));
          announcement.textContent = 'Rue munched a berry biscuit!';
        } else {
          progress.owned.push(item.id);
          feedback.textContent = `Unlocked! ${useItem(item)}`;
        }
      }
      persist();
      render();
    }

    open.addEventListener('click', () => {
      feedback.textContent = '';
      dialog.showModal();
    });
    document.querySelector('#close-shop').addEventListener('click', () => dialog.close());
    for (const button of filters) {
      button.addEventListener('click', () => {
        filter = button.dataset.shopFilter;
        feedback.textContent = '';
        render();
      });
    }
    skySwitch.addEventListener('click', () => {
      const next = nextSky();
      progress.sky = next.id;
      announcement.textContent = `${next.name} at Fox Hollow.`;
      persist();
      render();
    });
    render();
    return {
      snapshot: () => progress,
      restore(next, previousStars) {
        progress = readProgress(next, previousStars);
        render();
      },
      earn() {
        progress.balance++;
        render();
      }
    };
  };
})();
