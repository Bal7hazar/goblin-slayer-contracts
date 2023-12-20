import { useEffect, useState } from "react";
import { client } from "../server";

export const useTerraformer = () => {
    const [image, setImage] = useState("");
    const [background, setBackground] = useState("");
    const [portrait, setPortrait] = useState("");

    useEffect(() => {
        const backgrounds = async () => {
            const background = await client.world.image.query({
                name: "hell landscape",
            });

            setBackground(background[0]);
        };

        backgrounds();
    }, []);

    useEffect(() => {
        const input = async () => {
            const background = await client.world.image.query({
                name: "single realistic balrog",
            });
            setImage(background[0]);
        };

        input();
    }, []);

    useEffect(() => {
        const input = async () => {
            const portrait = await client.world.image.query({
                name: "the eldritch knight as a realistic fantasy knight, closeup portrait art by donato giancola and greg rutkowski, digital art, trending on artstation, symmetry! !",
            });

            setPortrait(portrait[0]);
        };

        input();
    }, []);

    return {
        image,
        background,
        portrait,
    };
};
