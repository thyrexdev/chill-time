import Image from "next/image";

interface ActorImgProps {
    image: string;
    id: string;
}

const ActorCard: React.FC<ActorImgProps> = ({ image, id }) => {

    return (
        <div className=" relative w-[330px] h-[335px] mt-[150px] mr-[100px]">
            <Image width={240} height={350} className=" w-[240px] h-[350px] rounded-2xl before:bg-cover" src={`${image}`} alt={`${id}`} />
        </div>
    );
};

export default ActorCard;
