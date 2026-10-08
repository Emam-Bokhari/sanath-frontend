// "use client"

// import { useRef, useEffect } from "react"
// import { Jodit } from "jodit"

// interface JoditEditorProps {
//   value?: string
//   onChange?: (value: string) => void
//   placeholder?: string
//   height?: number
//   readonly?: boolean
// }

// export default function JoditEditor({
//   value = "",
//   onChange,
//   placeholder = "Start typing...",
//   height = 400,
//   readonly = false,
// }: JoditEditorProps) {
//   const editorRef = useRef<HTMLTextAreaElement>(null)
//   const joditRef = useRef<Jodit | null>(null)

//   useEffect(() => {
//     if (editorRef.current && !joditRef.current) {
//       joditRef.current = Jodit.make(editorRef.current, {
//         height,
//         placeholder,
//         readonly,
//         toolbarSticky: false,
//         showCharsCounter: false,
//         showWordsCounter: false,
//         showXPathInStatusbar: false,
//         buttons: [
//           "font",
//           "fontsize",
//           "|",
//           "bold",
//           "italic",
//           "underline",
//           "|",
//           "ul",
//           "ol",
//           "|",
//           "outdent",
//           "indent",
//           "|",
//           "left",
//           "center",
//           "right",
//           "justify",
//           "|",
//           "link",
//           "image",
//           "|",
//           "table",
//           "|",
//           "undo",
//           "redo",
//           "|",
//           "hr",
//           "eraser",
//           "fullsize",
//         ],
//         events: {
//           change: (value: string) => {
//             if (onChange) {
//               onChange(value)
//             }
//           },
//         },
//       })

//       if (value) {
//         joditRef.current.value = value
//       }
//     }

//     return () => {
//       if (joditRef.current) {
//         joditRef.current.destruct()
//         joditRef.current = null
//       }
//     }
//   }, [height, placeholder, readonly])

//   useEffect(() => {
//     if (joditRef.current && joditRef.current.value !== value) {
//       joditRef.current.value = value
//     }
//   }, [value])

//   return <textarea ref={editorRef} />
// }
