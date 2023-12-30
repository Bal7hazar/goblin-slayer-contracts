import React, { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { shortString } from "starknet";
import { getRank, getTag, getTitle } from "../hooks/utils";

const GET_DATA = gql`
    query getSlayers {
        slayerModels(first: 10000) {
            edges {
                node {
                    id
                    name
                    tag
                    title
                    xp
                }
            }
        }
    }
`;

interface TSlayer {
    name: string;
    title: string;
    xp: string;
    self: boolean;
}

interface TProps {
    slayer: any;
}

const Leaderboard = (props: TProps) => {
    const { slayer } = props;
    const { loading, error, data, refetch } = useQuery(GET_DATA);

    useEffect(() => {
        refetch();
    }, [slayer, refetch]);

    const getHeader = () => {
        return (
            <>
                <div className="w-full flex justify-between">
                    <div className="w-32 flex justify-center items-center">
                        Rank
                    </div>
                    <div className="w-32 flex justify-center items-center">
                        Name
                    </div>
                    <div className="w-32 flex justify-center items-center">
                        XP
                    </div>
                    <div className="grow flex justify-center items-center">
                        Title
                    </div>
                </div>
                <div className="h-1 w-full bg-gray-100/70" />
            </>
        );
    };

    const getSlayer = (rank: number, { name, title, xp, self }: TSlayer) => {
        return (
            <div key={rank} className="w-full flex justify-between">
                <div className={`w-32 flex justify-center items-center underline-offset-2 ${self && 'underline text-red-400'}`}>
                    {`#${rank}`}
                </div>
                <div className={`w-32 flex justify-center items-center uppercase bold underline-offset-2 ${self && 'underline text-red-400'}`}>
                    {name}
                </div>
                <div className={`w-32 flex justify-center items-center underline-offset-2 ${self && 'underline text-red-400'}`}>
                    {xp}
                </div>
                <div className={`grow flex justify-center items-center underline-offset-2 ${self && 'underline text-red-400'}`}>
                    {title}
                </div>
            </div>
        );
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const slayers: TSlayer[] = data.slayerModels.edges
        .map((edge: any) => {
            const { id, name, tag, title, xp } = edge.node;
            return {
                name: shortString.decodeShortString(name.toString()),
                title: `${getTitle(title)} ${getTag(tag)} Slayer`,
                xp: parseInt(xp.toString(), 16),
                self: BigInt(id) === BigInt(slayer ? slayer.id : 0),
            };
        })
        .sort((a: any, b: any) => b.xp - a.xp)
        .slice(0, 10);

    return (
        <div className="h-96 flex flex-col justify-center items-center m-auto z-0 gap-2">
            {getHeader()}
            {slayers.map((slayer: TSlayer, index: number) =>
                getSlayer(index + 1, slayer)
            )}
        </div>
    );
};

export default Leaderboard;
