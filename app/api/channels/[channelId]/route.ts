import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    {params}: {params:{channelId: string}}
) {
    try{

        const profile = await currentProfile();
        const {searchParams} = new URL(req.url);

        const serverId= searchParams.get("serverId");

        if(!profile){
            return new NextResponse("Unauthorised",{status: 401});
        }

        if(!serverId){
            return new NextResponse("Server id is required",{status: 400});
        }

        if(!params.channelId){
            return new NextResponse("Channel id is required",{status: 400});
        }
        const server=await db.server.update({
            where:{
                id: serverId,
                memebers:{
                    some:{
                        profileId: profile.id,
                        role:{
                            in: [MemberRole.ADMIN,MemberRole.MODERATOR],
                        }
                    }
                }
            },
            data:{
                channels:{
                    delete:{
                        id: params.channelId,
                        name:{
                            not: "general",
                        }
                    }
                }
            }
        });
        return NextResponse.json(server);
    }catch(error){
        console.log("CHANNEL_ID_DELETE",error);
        return new NextResponse("Internal server error", {status:500});
    }
}

export async function PATCH(
    req: Request,
    {params}: {params:{channelId: string}}
) {
    try{

        const profile = await currentProfile();
        const {searchParams} = new URL(req.url);
        const { name, type} = await req.json();

        const serverId= searchParams.get("serverId");

        if(!profile){
            return new NextResponse("Unauthorised",{status: 401});
        }

        if(!serverId){
            return new NextResponse("Server id is required",{status: 400});
        }

        if(!params.channelId){
            return new NextResponse("Channel id is required",{status: 400});
        }
        
        if(name === "general"){
            return new NextResponse("Name can not be general",{status: 400});
        }

        const server=await db.server.update({
            where:{
                id: serverId,
                memebers:{
                    some:{
                        profileId: profile.id,
                        role:{
                            in: [MemberRole.ADMIN,MemberRole.MODERATOR],
                        }
                    }
                }
            },
            data:{
                channels:{
                    update:{
                       where:{
                        id: params.channelId,
                        NOT:{
                            name: "general",
                        },
                       },
                       data:{
                        name,
                        type,
                       }
                    }
                }
            }
        });
        return NextResponse.json(server);
    }catch(error){
        console.log("CHANNEL_ID_PATCH",error);
        return new NextResponse("Internal server error", {status:500});
    }
}