import { Resend } from "resend";
import { supabase } from "../../../lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST (request) {
    try {
        const record = await request.json();        
        if (!record) {
            return Response.json(
                { error: 'Missing post record' },
                { status: 400 }
            );
        }

        const { title, slug, excerpt, thumbnail } = record;
        const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/post/${slug}`;

        const { data: subscribers, error } = await supabase
        .from('subscribers')
        .select('email');

        if (error) {
            throw error;
        }

        for (const subscriber of subscribers) {
            await resend.emails.send({
                from: "Green Pastures <noreply@greenpastureshub.com>",
                to: subscriber.email,
                subject: `New Post: ${title}`,
                html:`
                <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
  
                <!-- Header -->
                <div style="background-color: #2d6a4f; padding: 32px 40px; text-align: center;">
                    <img 
                        src="https://wlqnpxjmdxecnqasyhmy.supabase.co/storage/v1/object/public/post-images/Green%20Pasture%20White%20Logo.png" 
                        alt="Green Pastures" 
                        style="height: 60px; width: auto; display: block; margin: 0 auto 12px;"
                    />
                    <p style="color: #C9A84C; font-size: 13px; margin: 0;">Nourishing Faith. Growing Lives.</p>
                </div>

                <!-- Thumbnail -->
                ${thumbnail ? `
                <div style="width: 100%; max-height: 300px; overflow: hidden;">
                    <img src="${thumbnail}" alt="${title}" style="width: 100%; object-fit: cover; display: block;" />
                </div>
                ` : ''}

                <!-- Body -->
                <div style="padding: 40px;">
                    <p style="color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">New Post</p>
                    <h2 style="color: #1b4332; font-size: 22px; margin: 0 0 16px; line-height: 1.4;">${title}</h2>
                    <p style="color: #1f2937; font-size: 16px; line-height: 1.7; margin: 0 0 28px;">${excerpt ?? ""}</p>
                    
                    <a href="${postUrl}" style="display: inline-block; background-color: #2d6a4f; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-size: 15px; font-family: Arial, sans-serif;">
                    Read Full Post →
                    </a>
                </div>

                <!-- Footer -->
                <div style="background-color: #f9fafb; padding: 24px 40px; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.6;">
                    You're receiving this email because you subscribed to Green Pastures.<br/>
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #2d6a4f;">Visit our website</a>
                    </p>
                </div>

                </div>
                `,
            
            });
        }
        return Response.json({
            success: true,
            emailsSent: subscribers.length,
        });
    }
    catch (error) {
        console.error('Email notification erroe:', error);

        return Response.json({
            success:false,
            error: error.message,
        }, { status: 500 })
    }
    
}
