using Microsoft.AspNet.Razor.Runtime.TagHelpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Trip_Planner.TagHelpers
{
	[HtmlTargetElement("div", Attributes = CheckboxValueAttributeName)]
	public class CheckboxTagHelper : TagHelper
	{
		private const string CheckboxValueAttributeName = "my-checkbox-for";

		[HtmlAttributeName(CheckboxValueAttributeName)]
		public string CheckboxName { get; set; }

		public override void Process(TagHelperContext context, TagHelperOutput output)
		{
			string checkboxContent = $@"<input asp-for='{CheckboxName}' id='{CheckboxName}' type='checkbox' class='filled-in'/>
										<label for='{CheckboxName}'>{CheckboxName}</label>";

			output.Content.Append(checkboxContent);

			base.Process(context, output);
		}
	}
}
