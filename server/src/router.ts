import { initTRPC } from "@trpc/server";
import { z } from "zod";
import Replicate from "replicate";
import dotenv from "dotenv";

dotenv.config();

const replicate = new Replicate({
    auth: process.env.REPLICATE_AUTH,
});

const t = initTRPC.create();

const publicProcedure = t.procedure;
const router = t.router;

const worldRouter = router({
    image: publicProcedure
        .input(z.object({ name: z.string() }).nullish())
        .query(({ input }) => {
            const runModel = async () => {
                const output = await replicate.run(
                    "fofr/sdxl-turbo:6244ebc4d96ffcc48fa1270d22a1f014addf79c41732fe205fb1ff638c409267",
                    {
                        input: {
                            prompt: input?.name,
                            width: 512,
                            height: 512,
                            num_outputs: 1,
                            num_inference_steps: 3,
                            agree_to_research_only: true,
                        },
                    }
                );

                return output;
            };
            return runModel();
        }),

    music: publicProcedure
        .input(z.object({ name: z.string() }).nullish())
        .query(({ input }) => {
            const runModel = async () => {
                const output = await replicate.run(
                    "meta/musicgen:b05b1dff1d8c6dc63d14b0cdb42135378dcb87f6373b0d3d341ede46e59e2b38",
                    {
                        input: {
                            model_version: "stereo-melody-large",
                            prompt: input?.name,
                            duration: 30,
                        },
                    }
                );

                console.log(output);

                return output;
            };
            return runModel();
        }),
});

export const appRouter = router({
    world: worldRouter,
});

export type AppRouter = typeof appRouter;
