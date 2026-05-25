// NOTE: check & normalize when isOrder is false
export function normalizeVisibleCAByEmail(stages) {
  const emailMap = {};
  stages.forEach((st) => {
    if (st.assigne?.email && st.options?.visible_ca) {
      if (!emailMap[st.assigne.email]) {
        emailMap[st.assigne.email] = [];
      }
      emailMap[st.assigne.email].push(st.id);
    }
  });

  let newStages = stages;

  Object.entries(emailMap).forEach(([email, ids]) => {
    if (ids.length > 1) {
      const keepId = ids[Math.floor(Math.random() * ids.length)];
      newStages = newStages.map((st) =>
        st.assigne?.email === email
          ? { ...st, options: { ...st.options, visible_ca: st.id === keepId } }
          : st,
      );
    }
  });

  return newStages;
}
