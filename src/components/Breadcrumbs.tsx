import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface Page{
    href?: string,
    name?: string
}

export function Breadcrumbs({pages, currentPage}: {pages: Page[], currentPage?: string}) {
  return (
    <Breadcrumb className='w-full'>
      <BreadcrumbList>
      {
        pages.map((page, index)=>(
            <div key={index} className="flex items-center gap-3">
                <BreadcrumbItem >
                    <BreadcrumbLink href={page.href}>{page.name}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
            </div>
        ))
      }
        <BreadcrumbItem>
          <BreadcrumbPage>{currentPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}