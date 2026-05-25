import { fileTypes } from "../data";

const FileIcon = ({ width = 68, height = 88, type }) => {
  const fileTypeMap = {
    [fileTypes.gif]: "GIF",
    [fileTypes.docx]: "DOCX",
    [fileTypes.docxOpenXML]: "DOCX",
    [fileTypes.pptx]: "PPTX",
    [fileTypes.xlsx]: "XLSX",
    [fileTypes.xls]: "XLS",
    [fileTypes.excelApplication]: "XLS",
    [fileTypes.excelMsexcel]: "XLS",
    [fileTypes.pdf]: "PDF",
    [fileTypes.dot]: "DOT",
    [fileTypes.zip]: "ZIP",
    [fileTypes.xZip]: "ZIP",
    [fileTypes.zipMime]: "ZIP",
    [fileTypes.rarMime]: "RAR",
    [fileTypes.rarExt]: "RAR",
    [fileTypes.sevenZMime]: "7Z",
    [fileTypes.sevenZExt]: "7Z",
  };

  const fileTypeText = fileTypeMap[type] || "FILE";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 68 88"
    >
      <defs>
        <linearGradient
          id="a"
          x1="50.486%"
          x2="49.86%"
          y1="132.903%"
          y2="41.27%"
        >
          <stop offset="0%" stopColor="#91A3FA" />
          <stop offset="100%" stopColor="#586AF2" />
        </linearGradient>
        <linearGradient
          id="b"
          x1="37.821%"
          x2="84.034%"
          y1="-15.668%"
          y2="86.451%"
        >
          <stop offset="0%" stopColor="#364494" />
          <stop offset="30%" stopColor="#334191" />
          <stop offset="60%" stopColor="#354393" stopOpacity=".4" />
          <stop offset="90%" stopColor="#354393" stopOpacity=".3" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <path
          fill="url(#a)"
          d="M56.777 10.133L49.4.723 46.649 0H2.093A2.093 2.093 0 0 0 0 2.093v83.814C0 87.063.937 88 2.093 88h63.815A2.092 2.092 0 0 0 68 85.908l-.013-64.522L67 19.063l-10.223-8.93z"
        />
        <path
          fill="url(#b)"
          d="M49.711 17.738L68 35.691l-.013-14.3s-.9-3.868-4.208-3.868c-3.308 0-14.068.215-14.068.215z"
        />
        <path
          fill="#7285F2"
          d="M66.786 17.738l-6.813-7.063-9.3-9.183-.013-.013a.312.312 0 0 0-.026-.026l-.017-.017-.076-.076-.086-.085-.023-.022-.31-.306-.112-.111-.16-.158-.142-.14C49.187.02 46.649 0 46.649 0c3 1.093 3.062 3.218 3.062 3.376v14.362h13.732c.832.043 3.154.461 4.544 3.648 0 0 .225-2.17-1.201-3.648z"
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="20"
          fill="white"
        >
          {fileTypeText}
        </text>
      </g>
    </svg>
  );
};

export default FileIcon;
