import { db } from "@/lib/db";

export const getOrCreateConversation = async (memberOneId: string,
    memberTwoId: string
)=>{
    let conversation = await findConversation(memberOneId,memberTwoId) || await findConversation(memberTwoId,memberOneId);

    if(!conversation){
        return await CreateNewConversation(memberOneId,memberTwoId);
    }
    return conversation;

}

const findConversation = async (memberOneId: string, MemberTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: MemberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
};

const CreateNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
};
