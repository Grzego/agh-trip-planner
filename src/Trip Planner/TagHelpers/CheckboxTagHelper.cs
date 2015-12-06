using Microsoft.AspNet.Mvc.Rendering;
using Microsoft.AspNet.Razor.TagHelpers;

namespace Trip_Planner.TagHelpers
{
	[HtmlTargetElement("input", Attributes = ForAttributeName)]
	public class CheckboxTagHelper : TagHelper
	{
		private const string ForAttributeName = "asp-checkbox-for";

	    [HtmlAttributeName(ForAttributeName)]
	    public ModelExpression For { get; set; }

	    public string Value { get; set; } = "false";

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            output.TagName = "input";
            output.TagMode = TagMode.SelfClosing;
            output.Attributes["id"] = For.Name;
            output.Attributes["value"] = Value;
            output.Attributes["name"] = For.Name;
            output.Attributes["data-val"] = Value;
            output.Attributes["type"] = "checkbox";

            var label = new TagBuilder("label");
            label.Attributes["for"] = For.Name;
            label.InnerHtml.Append(For.Metadata.DisplayName);
            output.PostElement.Append(label);

            var hidden = new TagBuilder("input");
            hidden.Attributes["type"] = "hidden";
            hidden.Attributes["value"] = "false";
            hidden.Attributes["name"] = For.Name;
            output.PostElement.Append(hidden);
            
            base.Process(context, output);
		}
	}
}
