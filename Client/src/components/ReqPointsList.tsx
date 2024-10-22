'use client'

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { jobPostSchemaType } from "@/schema/jobSchema";

type ResPointsListProps = {
    input: jobPostSchemaType;
    setInput: React.Dispatch<React.SetStateAction<jobPostSchemaType>>;
    errorHandler: (name: string, value: string[]) => void;
};

const ReqPointsList: React.FC<ResPointsListProps> = ({ input, setInput, errorHandler }) => {
    const [textareas, setTextareas] = useState([{ id: 1, value: '' }])

    const addTextarea = () => {
        const newId = textareas.length + 1
        setTextareas([...textareas, { id: newId, value: '' }])
    }

    const removeTextarea = (id: number) => {
        const updatedTextArea = textareas.filter(textarea => textarea.id !== id);
        setTextareas(updatedTextArea);
        const newPoints = updatedTextArea.map(textarea => textarea.value.trim()).filter(Boolean);
        setInput({ ...input, requirements: newPoints });
    }

    const handleTextareaChange = (id: number, value: string) => {
        const updatedTextArea = textareas.map(textarea =>
            textarea.id === id ? { ...textarea, value } : textarea
        );
        setTextareas(updatedTextArea);

        const newPoints = updatedTextArea.map(textarea => textarea.value.trim()).filter(Boolean);
        const newPoints2 = newPoints.length > 0 ? newPoints : [''];
        setInput({ ...input, requirements: newPoints2 });
        errorHandler('requirements', newPoints2);
    }

    return (
        <div>
            <div className="space-y-4">
                {textareas.map((textarea) => (
                    <div key={textarea.id} className="flex items-start space-x-2">
                        <Textarea
                            value={textarea.value}
                            onChange={(e) => handleTextareaChange(textarea.id, e.target.value)}
                            placeholder="Enter a point..."
                            className="flex-grow"
                        />
                        {textareas.length > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeTextarea(textarea.id)}
                                aria-label="Remove textarea"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
                <div className="flex justify-between">
                    <Button
                        type="button"
                        onClick={addTextarea}
                        variant="outline"
                        className="flex items-center"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Point
                    </Button>
                </div>
            </div>
            {/* {points.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-2">Submitted Points:</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        {points.map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                </div>
            )} */}
        </div>
    )
}

export default ReqPointsList;