import React from "react";
import { useQuery, gql } from "@apollo/client";
import { shortString } from "starknet";
import goldImage from "/src/assets/gold-64.png";
import xpImage from "/src/assets/xp-64.png";
import { getRank, getTag, getTitle } from "../hooks/utils";

const GET_DATA = gql`
    query getSlayers {
        slayerModels(first: 10000) {
            edges {
                node {
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
}

const Leaderboard = () => {
    const { loading, error, data } = useQuery(GET_DATA);

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

    const getSlayer = (rank: number, { name, title, xp }: TSlayer) => {
        return (
            <div className="w-full flex justify-between">
                <div className="w-32 flex justify-center items-center">{`#${rank}`}</div>
                <div className="w-32 flex justify-center items-center uppercase">
                    {name}
                </div>
                <div className="w-32 flex justify-center items-center">
                    {xp}
                </div>
                <div className="grow flex justify-center items-center">
                    {title}
                </div>
            </div>
        );
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const slayers: TSlayer[] = data.slayerModels.edges
        .map((edge: any) => {
            const { name, tag, title, xp } = edge.node;
            return {
                name: shortString.decodeShortString(name.toString()),
                title: `${getTitle(title)} ${getTag(tag)} Slayer`,
                xp: parseInt(xp.toString(), 16),
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
