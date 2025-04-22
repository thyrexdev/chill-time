import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Quality {
    _id: string;
    type: string;
    download: string;
}

interface QualitySelectionModalProps {
    qualities: Quality[];
    onSelectQuality: (watchLink: string) => void;
}


const QualitySelectionModal: React.FC<QualitySelectionModalProps> = ({ qualities, onSelectQuality }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
            <div className="bg-red-600 p-8 rounded-lg text-white">
                <h3 className="mb-4 text-lg flex px-9">اختار الجودة:</h3>
                <div className="flex flex-wrap justify-center">
                    {qualities.map((quality: Quality) => (
                        <button
                            key={quality._id}
                            className="hover:bg-white hover:text-red-600 border border-white rounded-lg px-4 py-2 mb-2 mr-2 transition duration-300 bg-red-600 text-white"
                            onClick={() => onSelectQuality(quality.download)}
                        >
                            {quality.type}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const MovieWatchBtn = () => {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [qualities, setQualities] = useState<Quality[]>([]);
    const [showQualitySelection, setShowQualitySelection] = useState(false);

    const handleDownloadNow = () => {
        setLoading(true);
        const mockQualities: Quality[] = [
            { _id: "1", type: "720p", download: `/movie/${id}/watch/720p` },
            { _id: "2", type: "1080p", download: `/movie/${id}/watch/1080p` }
        ];
        setQualities(mockQualities);
        setShowQualitySelection(true);
        setLoading(false);
    };

    const handleSelectQuality = (watchLink: string) => {
        setShowQualitySelection(false);
        router.push(watchLink);
    };

    return (
        <>
            {showQualitySelection && (
                <QualitySelectionModal
                    qualities={qualities}
                    onSelectQuality={handleSelectQuality}
                />
            )}
            <button
                className="w-[100px] bg-red-600 text-white rounded-2xl pt-1 pb-1 pr-4 pl-4 hover:duration-[0.4s] hover:bg-white hover:text-red-600 lg:ml-0 ml-10"
                onClick={handleDownloadNow}
                disabled={loading}
            >
                {loading ? "جاري التحميل..." : "شاهد الآن"}
            </button>
        </>
    );
};

export default MovieWatchBtn;