import { getSignigGroupDetail as getSignigGroupDetailApi } from "../apis/settings";
import { ASSIGNE_DEFAULTS } from "../constants/assigne";

// NOTE: api to ui
export const getCompleteSigners = async (group) => {
  if (!group) {
    return [];
  }

  const id = group.combination_id;
  const payload = { combination_id: id };
  const resp = await getSignigGroupDetailApi(payload);

  if (!resp.data || !resp.data.details) {
    return group.details || [];
  }
  if (resp.data.details.length < 1) {
    return group.details || [];
  }

  const basedStageId = resp.data.details[0].stage_id;
  const signers =
    resp.data.details.map((stg) => {
      const newStage = {
        ...stg,
        key: stg.stage_id - basedStageId,
        uid: stg.stage_id,
        stage_type: stg.stage_type,
        action: stg.action,
        actor_info: stg.actor_info,
        others: stg.stage_setting ? { ...stg.stage_setting } : {},
      };

      delete newStage.stage_setting;
      delete newStage.review_stages;

      return newStage;
    }) || [];

  return signers;
};

// NOTE: ui to api
export const getApiSigners = (signers) => {
  if (!signers) {
    return [];
  }

  const newSigners = signers.map((signer) => {
    const newSigner = {
      ...signer,
      stage_setting: signer.others || {},
    };
    delete newSigner.reviewed_by;
    delete newSigner.others;

    return newSigner;
  });

  return newSigners;
};

// NOTE: when importing
export const getImportUidTransfer = ({ user, assignes, signers }) => {
  if (!assignes) {
    return [];
  }
  if (!signers) {
    return [];
  }

  const signersRev = (() => {
    if (!user) {
      return [...signers];
    }

    return signers.map((signer) => {
      if (signer.email === user.email) {
        return {
          ...signer,
          others: {
            ...signer.others,
            ...ASSIGNE_DEFAULTS.me,
          },
        };
      }

      return signer;
    });
  })();

  const newSigners = signersRev.map((signer, idx) => {
    if (signer && assignes[idx]) {
      const reviewedBy = (() => {
        if (!signer.reviewed_by || signer.reviewed_by.length < 1) {
          return [];
        }

        const stages = [];
        signer.reviewed_by.map((stg) => {
          const index = stg.base_stage_rank - 1;
          if (!assignes[index]) {
            return;
          }

          stages.push({
            ...stg,
            signer_uid: assignes[index].uid,
          });
        });

        return stages;
      })();

      return {
        ...signer,
        uid: assignes[idx]?.uid || signer.uid,
        reviewed_by: reviewedBy,
      };
    }

    return signer;
  });

  return newSigners;
};
