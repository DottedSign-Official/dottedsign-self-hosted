import LoadingComponent from "../LoadingComponent";
import Button from "../Button";

const LoadingWrapper = ({ isLoading, children, ...props }) => {
  if (!isLoading) {
    return children || null;
  }
  return <LoadingComponent {...props} />;
};

const ButtonWithLoading = ({ children, isLoading, handleEvent, ...props }) => {
  return (
    <Button handleEvent={isLoading ? () => {} : handleEvent} {...props}>
      <LoadingWrapper width="18px" height="18px" isLoading={isLoading}>
        {children}
      </LoadingWrapper>
    </Button>
  );
};

export default ButtonWithLoading;
