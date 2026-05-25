import PropTypes, {
  dropdownMenu,
  envelopeOrTaskId,
} from "../../helpers/propTypes";

const propTypes = {
  navbar: PropTypes.shape({
    expiredReminder: PropTypes.shape({
      isVisible: PropTypes.bool,
      days: PropTypes.number,
    }).isRequired,
    moreMenu: PropTypes.shape({
      changeSigner: dropdownMenu.changeSigner,
      notifyOwner: dropdownMenu.notifyOwner,
      previewShareLink: dropdownMenu.previewShareLink,
      declineToSign: PropTypes.shape({
        isVisible: PropTypes.bool.isRequired,
        data: PropTypes.shape({
          taskId: envelopeOrTaskId,
          envelopeId: envelopeOrTaskId,
          taskName: PropTypes.string.isRequired,
          declineReasons: PropTypes.arrayOf(
            PropTypes.shape({
              content: PropTypes.string.isRequired,
              id: PropTypes.number.isRequired,
            }),
          ).isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
    download: PropTypes.shape({
      isVisible: PropTypes.bool.isRequired,
      data: PropTypes.shape({
        taskId: envelopeOrTaskId,
        envelopeId: envelopeOrTaskId,
        auditTrail: PropTypes.shape({
          isVisible: PropTypes.bool.isRequired,
          disabled: PropTypes.bool.isRequired,
        }).isRequired,
        attachment: PropTypes.shape({
          isVisible: PropTypes.bool.isRequired,
          link: PropTypes.string,
        }).isRequired,
      }).isRequired,
    }).isRequired,
    signSteps: PropTypes.shape({
      isVisible: PropTypes.bool.isRequired,
      data: PropTypes.shape({
        colorId: PropTypes.number.isRequired,
        requiredIds: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            page: PropTypes.number.isRequired,
          }),
        ),
      }).isRequired,
    }).isRequired,
    taskInfo: PropTypes.shape({
      isVisible: PropTypes.bool.isRequired,
    }).isRequired,
    menu: PropTypes.shape({
      message: PropTypes.shape({
        isVisible: PropTypes.bool.isRequired,
        data: PropTypes.shape({
          isCompleted: PropTypes.bool.isRequired,
        }).isRequired,
      }).isRequired,
      downloadPDF: PropTypes.shape({
        isVisible: PropTypes.bool.isRequired,
        disabled: PropTypes.bool.isRequired,
        data: PropTypes.shape({
          filename: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
      redirect: PropTypes.shape({
        isVisible: PropTypes.bool.isRequired,
        link: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default propTypes;
