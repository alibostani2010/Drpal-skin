        success: true,
      } as const;
    }),
  }),

  analysis: router({
    analyze: publicProcedure
      .input(z.object({
        imageData: z.string(),
        language: z.enum(["fa", "ar", "en"]).default("fa"),
        userContext: z.object({
          skinTypeSelfReported: z.string(),
          concern: z.string(),
          recentTreatments: z.string(),
          routineLevel: z.string(),
          sunscreenUsage: z.string(),
        }),
      }))
      .mutation(async ({ input, ctx }) => {
        // Upload image to S3
        const base64Data = input.imageData.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const randomSuffix = crypto.randomBytes(8).toString('hex');
        const fileKey = `analyses/${Date.now()}-${randomSuffix}.jpg`;
        
        const { url: imageUrl } = await storagePut(fileKey, buffer, 'image/jpeg');

        // Call LLM for analysis
        let userContextText = "";
        let languageInstruction = "";