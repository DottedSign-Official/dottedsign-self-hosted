import getConfig from "next/config";
import Version from "../../components/Version";

const { publicRuntimeConfig } = getConfig();
const version = publicRuntimeConfig.VERSION;
const VersionContainer = () => <Version version={version} />;

export default VersionContainer;
