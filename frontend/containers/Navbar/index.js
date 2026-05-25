import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import Loader from "../../components/Loaders/Navbar";

const NavbarContainer = ({ isGuestSign }) => {
  const user = useSelector((state) => state.auth.user);
  const isRenderDone = useSelector((state) => state.pdf.isRenderDone);
  const { coverType } = useSelector((state) => state.common);
  const { navbar, fileFocus, isEnvelope, filename, isPublicForm } = useSelector(
    (state) => state.sign,
  );

  if (!isRenderDone && !coverType) {
    return <Loader />;
  }

  return (
    <Navbar
      navbar={navbar}
      filename={filename}
      fileFocus={fileFocus}
      isEnvelope={isEnvelope}
      isGuestSign={isGuestSign}
      showAction={!!user && !coverType}
      showDropdownMenu={!coverType && !isPublicForm}
      showOtherMenu={!isPublicForm}
    />
  );
};

export default NavbarContainer;
