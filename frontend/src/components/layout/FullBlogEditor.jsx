import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"

import { TextStyle } from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"

import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableCell } from "@tiptap/extension-table-cell"
import { TableHeader } from "@tiptap/extension-table-header"

import Placeholder from "@tiptap/extension-placeholder"
import CharacterCount from "@tiptap/extension-character-count"
import Dropcursor from "@tiptap/extension-dropcursor"

import {
    Bold,
    Italic,
    Heading2,
    List,
    ImageIcon,
    LinkIcon,
    TableIcon,
    Palette
} from "lucide-react"

export default function FullBlogEditor({ value, setValue }) {

    const editor = useEditor({

        extensions: [
            StarterKit,
            Image,
            Link,
            TextStyle,
            Color,
            Dropcursor,
            CharacterCount,
            Placeholder.configure({
                placeholder: "Write your research article..."
            }),
            Table.configure({ resizable: true }),
            TableRow,
            TableCell,
            TableHeader
        ],

        content: value,

        onUpdate: ({ editor }) => {
            setValue(editor.getHTML())
        }

    })

    if (!editor) return null

    const addImage = () => {
        const url = prompt("Image URL")
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const addLink = () => {
        const url = prompt("Enter Link")
        editor.chain().focus().setLink({ href: url }).run()
    }

    return (

        <div className="w-full min-h-screen flex flex-col border rounded-xl bg-white">

            {/* Toolbar */}

            <div className="flex gap-2 flex-wrap p-3 border-b bg-gray-50">

                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className="p-2 hover:bg-gray-200 rounded"
                >
                    <Bold size={18} />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className="p-2 hover:bg-gray-200 rounded"
                >
                    <Italic size={18} />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className="p-2 hover:bg-gray-200 rounded"
                >
                    <Heading2 size={18} />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className="p-2 hover:bg-gray-200 rounded"
                >
                    <List size={18} />
                </button>

                <button
                    onClick={addImage}
                    className="p-2 hover:bg-gray-200 rounded"
                >
                    <ImageIcon size={18} />
                </button>

                <button
                    onClick={addLink}
                    className="p-2 hover:bg-gray-200 rounded"
                >
                    <LinkIcon size={18} />
                </button>

                <button
                    onClick={() => editor.chain().focus().setColor("red").run()}
                    className="p-2 hover:bg-gray-200 rounded"
                >
                    <Palette size={18} />
                </button>

                <button
                    onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}
                    className="p-2 hover:bg-gray-200 rounded"
                >
                    <TableIcon size={18} />
                </button>

            </div>

            {/* Editor */}

            <div className="flex-1 overflow-auto p-10">

                <EditorContent
                    editor={editor}
                    className="prose max-w-none focus:outline-none"
                />

            </div>

            {/* Footer */}

            <div className="border-t p-2 text-sm text-gray-500">

                Words: {editor.storage.characterCount.words()}

            </div>

        </div>

    )
}