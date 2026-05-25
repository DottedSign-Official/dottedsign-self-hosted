import PropTypes, {
  statusText,
  dropdownMenu,
  flowGraph,
  envelopeOrTaskId,
  envelopeOrFilename,
} from "../../helpers/propTypes";

const propTypes = {
  allTasks: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string.isRequired,
      expiresDays: PropTypes.number,
      thumbnail: PropTypes.string.isRequired,
      envelopeName: envelopeOrFilename,
      filename: envelopeOrFilename,
      createdTime: PropTypes.string.isRequired,
      owner: PropTypes.string.isRequired,
      stages: PropTypes.arrayOf(flowGraph).isRequired,
      moreMenu: PropTypes.shape({
        signerStatus: PropTypes.shape({
          isVisible: PropTypes.bool.isRequired,
          data: PropTypes.shape({
            taskId: envelopeOrTaskId,
            envelopeId: envelopeOrTaskId,
            envelopeName: envelopeOrFilename,
            filename: envelopeOrFilename,
            thumbnail: PropTypes.string.isRequired,
            createTime: PropTypes.string.isRequired,
            modifiedTime: PropTypes.string.isRequired,
            stages: PropTypes.arrayOf(
              PropTypes.shape({
                ...statusText,
                iconURL: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                email: PropTypes.string.isRequired,
                isResend: PropTypes.bool.isRequired,
              }),
            ).isRequired,
          }).isRequired,
        }).isRequired,
        auditTrail: PropTypes.shape({
          isVisible: PropTypes.bool.isRequired,
          data: PropTypes.shape({
            taskId: envelopeOrTaskId,
            envelopeId: envelopeOrTaskId,
            envelopeName: envelopeOrFilename,
            filename: envelopeOrFilename,
            thumbnail: PropTypes.string.isRequired,
            createTime: PropTypes.string.isRequired,
            modifiedTime: PropTypes.string.isRequired,
          }).isRequired,
        }).isRequired,
        downloadPDF: PropTypes.shape({
          isVisible: PropTypes.bool.isRequired,
          data: PropTypes.shape({
            taskId: envelopeOrTaskId,
            envelopeId: envelopeOrTaskId,
            envelopeName: envelopeOrFilename,
            filename: envelopeOrFilename,
          }).isRequired,
        }).isRequired,
        downloadAuditTrail: PropTypes.shape({
          isVisible: PropTypes.bool.isRequired,
          data: PropTypes.shape({
            taskId: envelopeOrTaskId,
            envelopeId: envelopeOrTaskId,
          }).isRequired,
        }).isRequired,
        rename: PropTypes.shape({
          isVisible: PropTypes.bool.isRequired,
          data: PropTypes.shape({
            taskId: envelopeOrTaskId,
            envelopeId: envelopeOrTaskId,
            envelopeName: envelopeOrFilename,
            filename: envelopeOrFilename,
          }).isRequired,
        }).isRequired,
        changeSigner: dropdownMenu.changeSigner,
        notifyOwner: dropdownMenu.notifyOwner,
        previewShareLink: dropdownMenu.previewShareLink,
        deleteTask: PropTypes.shape({
          isVisible: PropTypes.bool.isRequired,
          data: PropTypes.shape({
            taskId: envelopeOrTaskId,
            envelopeId: envelopeOrTaskId,
            isSignAndSend: PropTypes.bool.isRequired,
          }).isRequired,
        }).isRequired,
      }).isRequired,
    }),
  ),
};

export default propTypes;
