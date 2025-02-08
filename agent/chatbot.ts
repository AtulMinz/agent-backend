import {
  AgentKit,
  cdpApiActionProvider,
  cdpWalletActionProvider,
  CdpWalletProvider,
  erc20ActionProvider,
  walletActionProvider,
  wethActionProvider,
} from "@coinbase/agentkit";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI, OpenAI } from "@langchain/openai";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import * as dotenv from "dotenv";

dotenv.config();

async function initializeAgent() {
  try {
    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
    });

    const config = {
      apiKeyName: process.env.CDP_API_KEY_NAME,
      apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY,

      networkId: process.env.NETWORK_ID,
      walletData: `0x${process.env.WALLET_PRIVATE_KEY}`,
    };

    console.log(config);

    const walletProvider = await CdpWalletProvider.configureWithWallet(config);

    const agentKit = await AgentKit.from({
      walletProvider,
      actionProviders: [
        wethActionProvider(),
        erc20ActionProvider(),
        walletActionProvider(),
        cdpApiActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY,
        }),
      ],
    });

    const tools = await getLangChainTools(agentKit);

    const memory = new MemorySaver();
    const agentConfig = {
      configurable: { thread_id: "PromptPay Agent" },
    };

    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier:
        "You're a helpful assistant that can help with a variety of tasks related to web3 tranactions." +
        "You should only use the provided tools to carry out tasks, interperate the users input" +
        "and select the correct tool to use for the required tasks or tasks.",
    });
    return { agent, config: agentConfig };
  } catch (error) {
    // console.error(error);
    console.log(error);
  }
}

initializeAgent();
