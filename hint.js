// Sequence of IDs in the order to glow
  const sequence = ['up','right','down','left'];
  let idx = 0;
  let timer = null;
  const stepDuration = 700; // ms, match --glow-duration if you like

  function startSequence() {
    stopSequence();
    timer = setInterval(() => {
      // remove glow from previous
      document.querySelectorAll('.btn.glow').forEach(b => b.classList.remove('glow'));

      // add glow to current
      const id = sequence[idx % sequence.length];
      const el = document.getElementById(id);
      if (el) el.classList.add('glow');

      idx++;
    }, stepDuration);
  }

  function stopSequence() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // start on load
  startSequence();

  // Optional: if user hovers or focuses any button, pause the auto-tip to avoid distraction
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', stopSequence);
    btn.addEventListener('focus', stopSequence);
    btn.addEventListener('mouseleave', startSequence);
    btn.addEventListener('blur', startSequence);

    // make buttons clickable (you might connect these to your game)
    btn.addEventListener('click', () => {
      // dispatch a custom event if you want to integrate with your game code:
      // window.dispatchEvent(new CustomEvent('tipControlPress', { detail: { id: btn.id } }));
      // or call your game's control handler directly if available
      console.log('Pressed', btn.id);
    });
  });

  // pause sequence on visibility change to save CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopSequence();
    else startSequence();
  });