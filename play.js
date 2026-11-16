(() => {
  const get = id => document.getElementById(id);
  const play = get('play-fireflies');
  const playLabel = play.querySelector('span');
  const pet = get('pet-rue');
  const firefly = get('firefly');
  const counter = get('fly-counter');
  const score = get('fly-score');
  const note = get('play-note');
  const pips = get('fly-pips');
  const sparkles = get('catch-sparkles');
  const perRound = 6;
  const positions = [[68, 35], [24, 66], [81, 59], [43, 35], [62, 75], [30, 47]];
  let caught = 0;
  let round = 0;
  let petTimer;
  let sparkleTimer;
  const petReactions = [
    {kind: 'wink', message: 'Rue gives you a wink.'},
    {kind: 'wag', message: 'Rue wags their tail.'},
    {kind: 'hop', message: 'Rue hops and sends a little heart.'}
  ];
  const spinReaction = {kind: 'spin', message: 'Rue does a little spin in a shower of sparkles!'};
  const spinChance = 0.05;
  let lastReaction;

  for (let i = 0; i < perRound; i++) {
    pips.append(document.createElement('i'));
  }

  function placeFirefly() {
    const [x, y] = positions[(caught + round) % positions.length];
    firefly.style.left = x + '%';
    firefly.style.top = y + '%';
  }

  function updateScore() {
    score.textContent = caught === perRound ? 'Jar full!' : `${caught} / ${perRound} caught`;
    for (const [index, pip] of [...pips.children].entries()) {
      pip.classList.toggle('lit', index < caught);
    }
  }

  function startRound() {
    clearTimeout(sparkleTimer);
    sparkles.replaceChildren();
    caught = 0;
    counter.hidden = false;
    firefly.hidden = false;
    play.setAttribute('aria-pressed', 'true');
    playLabel.textContent = 'End game';
    updateScore();
    placeFirefly();
    firefly.focus({preventScroll: true});
    note.textContent = 'Catch six fireflies to fill the jar.';
  }

  function endRound(complete) {
    firefly.hidden = true;
    counter.hidden = !complete;
    play.setAttribute('aria-pressed', 'false');
    playLabel.textContent = complete ? 'Play again' : 'Catch fireflies';
    round++;
    if (complete) {
      play.focus({preventScroll: true});
      note.textContent = 'You caught all six fireflies. Your jar is full!';
      document.dispatchEvent(new Event('rue-cheer'));
    } else {
      note.textContent = 'Firefly game ended.';
    }
  }

  function scatterSparks() {
    clearTimeout(sparkleTimer);
    const burst = document.createElement('span');
    burst.className = 'spark-burst';
    burst.style.left = firefly.style.left;
    burst.style.top = firefly.style.top;
    for (const [x, y] of [[-23,-16], [0,-25], [19,-16], [24,8], [2,22], [-19,13]]) {
      const spark = document.createElement('i');
      spark.style.setProperty('--spark-x', x + 'px');
      spark.style.setProperty('--spark-y', y + 'px');
      burst.append(spark);
    }
    sparkles.append(burst);
    burst.addEventListener('animationend', () => burst.remove(), {once: true});
    sparkleTimer = setTimeout(() => sparkles.replaceChildren(), 750);
  }

  play.addEventListener('click', () => {
    if (firefly.hidden) startRound();
    else endRound(false);
  });

  firefly.addEventListener('click', () => {
    if (firefly.hidden) return;
    scatterSparks();
    caught++;
    updateScore();
    if (caught === perRound) {
      endRound(true);
    } else {
      note.textContent = `${caught} of ${perRound} fireflies caught.`;
      placeFirefly();
    }
  });

  firefly.addEventListener('keydown', event => {
    if (event.repeat && (event.code === 'Enter' || event.code === 'Space')) {
      event.preventDefault();
    }
  });

  function petRue() {
    const choices = petReactions.filter(reaction => reaction !== lastReaction);
    const reaction = lastReaction !== spinReaction && Math.random() < spinChance
      ? spinReaction
      : choices[Math.floor(Math.random() * choices.length)];
    lastReaction = reaction;
    document.dispatchEvent(new CustomEvent('rue-cheer', {detail: reaction.kind}));
    document.dispatchEvent(new CustomEvent('rue-petted', {detail: reaction.kind}));
    note.replaceChildren(reaction.message);
    pet.classList.add('happy');
    clearTimeout(petTimer);
    petTimer = setTimeout(() => pet.classList.remove('happy'), 850);
  }

  pet.addEventListener('click', petRue);
  get('pet-portrait').addEventListener('click', petRue);
})();
