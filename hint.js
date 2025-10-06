// Sequence of IDs in the order to glow
  const sequence = ['up','right','down','left'];
  let idx = 0;
  let timer = null;
  const stepDuration = 700; // ms, match --glow-duration if you like
  let isNewbie = localStorage.getItem("isNewbie") || true; 
  const hintCard = document.getElementById("hintCard"); 

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
  if(isNewbie === true) {
        hintCard.classList.add("is-open");
        startSequence();
        localStorage.setItem("isNewbie", false); 
  }


