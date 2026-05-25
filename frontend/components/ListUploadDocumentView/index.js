import { Recipients, Recipient, Name } from "./styled";

const ListUploadDocumentView = ({ files }) =>
  files && (
    <Recipients>
      {files.map((file, idx) => (
        <Recipient key={idx}>
          <Name>{file.name}</Name>
        </Recipient>
      ))}
    </Recipients>
  );

export default ListUploadDocumentView;
