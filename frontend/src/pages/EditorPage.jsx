import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import FullBlogEditor from "../components/layout/FullBlogEditor"

export default function EditorPage() {

    const navigate = useNavigate()
    const location = useLocation()

    const [content, setContent] = useState(location.state?.description || "")

    const handleSave = () => {

        navigate("/admin/posts", {
            state: { description: content }
        })

    }

    return (

        <div className="max-w-5xl mx-auto p-6 space-y-6">

            <h2 className="text-2xl font-bold">Write Description</h2>

            <FullBlogEditor
                value={content}
                setValue={setContent}
            />

            <Button onClick={handleSave}>
                Save Description
            </Button>

        </div>

    )

}